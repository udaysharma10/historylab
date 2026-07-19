// test-engine — the single server authority for the CBSE test engine (plan §7, §12.1).
// The server owns the clock and the scores: attempts/answers/marks are written
// only here (service role); questions carry answer keys and are served without
// them during an attempt, revealed only on a submitted attempt's results.
//
// Actions (POST {action, ...}):
//   student: list, start, save, submit, result
//   admin:   upsert_paper, get_paper, set_status, delete_paper, admin_list
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GRACE_SECONDS = 30; // network slack added to the paper duration
const MAX_TEXT_LEN = 8000;
const MAX_SAVE_BATCH = 60;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

type Json = Record<string, unknown>;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } },
  );
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return json({ error: "unauthorized" }, 401);

  let body: Json;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad request" }, 400);
  }
  const action = body.action;
  if (typeof action !== "string") return json({ error: "bad request" }, 400);

  const service = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: adminRow } = await service
    .from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  const isAdmin = !!adminRow;

  try {
    switch (action) {
      case "list": return await list(service, user.id, isAdmin, body);
      case "start": return await start(service, user.id, isAdmin, body);
      case "save": return await save(service, user.id, body);
      case "submit": return await submit(service, user.id, body);
      case "result": return await result(service, user.id, body);
      case "upsert_paper":
      case "get_paper":
      case "set_status":
      case "delete_paper":
      case "admin_list": {
        if (!isAdmin) return json({ error: "forbidden" }, 403);
        if (action === "upsert_paper") return await upsertPaper(service, body);
        if (action === "get_paper") return await getPaperAdmin(service, body);
        if (action === "set_status") return await setStatus(service, body);
        if (action === "delete_paper") return await deletePaper(service, body);
        return await adminList(service);
      }
      default:
        return json({ error: "unknown action" }, 400);
    }
  } catch (e) {
    console.error(`test-engine ${action} failed:`, e);
    return json({ error: "internal error" }, 500);
  }
});

// ============================================================
// helpers
// ============================================================

function validSlug(v: unknown): v is string {
  return typeof v === "string" && /^[a-z0-9-]{1,60}$/.test(v);
}

async function hasChapterAccess(
  service: ReturnType<typeof createClient>,
  userId: string,
  chapterId: string,
): Promise<boolean> {
  const { data } = await service.rpc("has_access", {
    p_user: userId,
    p_chapter: chapterId,
  });
  return data === true;
}

// Auto-submit any expired in_progress attempts so no zombie attempts linger.
async function finalizeExpired(
  service: ReturnType<typeof createClient>,
  userId: string,
  paperId?: string,
) {
  let q = service
    .from("attempts")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "in_progress")
    .lt("deadline", new Date().toISOString());
  if (paperId) q = q.eq("paper_id", paperId);
  const { data: expired } = await q;
  for (const a of expired ?? []) {
    await markAndSubmit(service, a.id as string, true);
  }
}

// The marking core: score saved mcq answers against the key, finalize the attempt.
// Idempotent — a submitted attempt is left untouched.
async function markAndSubmit(
  service: ReturnType<typeof createClient>,
  attemptId: string,
  auto: boolean,
) {
  const { data: attempt } = await service
    .from("attempts").select("*").eq("id", attemptId).single();
  if (!attempt || attempt.status === "submitted") return attempt;

  const { data: questions } = await service
    .from("questions")
    .select("id, qtype, marks, correct_index")
    .eq("paper_id", attempt.paper_id);
  const { data: answers } = await service
    .from("answers").select("question_id, response").eq("attempt_id", attemptId);
  const responseByQ = new Map(
    (answers ?? []).map((a) => [a.question_id as string, a.response as Json]),
  );

  let objectiveAwarded = 0;
  let objectiveMax = 0;
  for (const q of questions ?? []) {
    if (q.qtype !== "mcq") continue;
    objectiveMax += q.marks as number;
    const response = responseByQ.get(q.id as string);
    const choice = response?.choice;
    const isCorrect = typeof choice === "number" && choice === q.correct_index;
    if (response !== undefined) {
      await service
        .from("answers")
        .update({ is_correct: isCorrect, marks_awarded: isCorrect ? q.marks : 0 })
        .eq("attempt_id", attemptId)
        .eq("question_id", q.id);
    }
    if (isCorrect) objectiveAwarded += q.marks as number;
  }

  const { data: updated } = await service
    .from("attempts")
    .update({
      status: "submitted",
      submitted_at: new Date().toISOString(),
      auto_submitted: auto,
      objective_awarded: objectiveAwarded,
      objective_max: objectiveMax,
    })
    .eq("id", attemptId)
    .select()
    .single();
  return updated;
}

// ============================================================
// student actions
// ============================================================

async function list(
  service: ReturnType<typeof createClient>,
  userId: string,
  isAdmin: boolean,
  body: Json,
) {
  if (!validSlug(body.chapter)) return json({ error: "bad request" }, 400);
  const chapter = body.chapter;

  await finalizeExpired(service, userId);

  const papersQ = service
    .from("papers")
    .select("id, chapter_id, title, description, total_marks, objective_marks, question_count, duration_minutes, position, status")
    .eq("chapter_id", chapter)
    .order("position");
  const { data: papers } = isAdmin ? await papersQ : await papersQ.eq("status", "published");

  const paperIds = (papers ?? []).map((p) => p.id as string);
  const { data: attempts } = paperIds.length
    ? await service
      .from("attempts")
      .select("id, paper_id, status, started_at, deadline, submitted_at, auto_submitted, objective_awarded, objective_max")
      .eq("user_id", userId)
      .in("paper_id", paperIds)
      .order("created_at", { ascending: false })
    : { data: [] };

  const entitled = isAdmin || await hasChapterAccess(service, userId, chapter);
  return json({ papers: papers ?? [], attempts: attempts ?? [], entitled });
}

async function start(
  service: ReturnType<typeof createClient>,
  userId: string,
  isAdmin: boolean,
  body: Json,
) {
  if (!validSlug(body.paper_id)) return json({ error: "bad request" }, 400);

  const { data: paper } = await service
    .from("papers").select("*").eq("id", body.paper_id).maybeSingle();
  if (!paper) return json({ error: "not found" }, 404);
  if (paper.status !== "published" && !isAdmin) return json({ error: "not found" }, 404);

  // The test engine is paid-only (decision #14) — preview users get a 403 and
  // the purchase sheet client-side.
  if (!isAdmin && !(await hasChapterAccess(service, userId, paper.chapter_id as string))) {
    return json({ error: "forbidden" }, 403);
  }

  await finalizeExpired(service, userId, paper.id as string);

  // Resume a live attempt if one exists, else open a fresh one.
  const { data: live } = await service
    .from("attempts")
    .select("*")
    .eq("user_id", userId)
    .eq("paper_id", paper.id)
    .eq("status", "in_progress")
    .maybeSingle();

  let attempt = live;
  if (!attempt) {
    const deadline = new Date(
      Date.now() + (paper.duration_minutes as number) * 60_000 + GRACE_SECONDS * 1000,
    ).toISOString();
    const { data: created, error } = await service
      .from("attempts")
      .insert({ user_id: userId, paper_id: paper.id, deadline })
      .select()
      .single();
    if (error) return json({ error: "could not start attempt" }, 500);
    attempt = created;
  }

  const [{ data: questions }, { data: sources }, { data: saved }] = await Promise.all([
    // Answer keys and schemes stay server-side during the attempt.
    service
      .from("questions")
      .select("id, position, section_label, qtype, marks, prompt, hint, source_id, options")
      .eq("paper_id", paper.id)
      .order("position"),
    service.from("paper_sources").select("source_id, title, body").eq("paper_id", paper.id),
    service.from("answers").select("question_id, response").eq("attempt_id", attempt.id),
  ]);

  return json({
    attempt: {
      id: attempt.id,
      status: attempt.status,
      started_at: attempt.started_at,
      deadline: attempt.deadline,
    },
    server_now: new Date().toISOString(),
    paper: {
      id: paper.id,
      chapter_id: paper.chapter_id,
      title: paper.title,
      description: paper.description,
      total_marks: paper.total_marks,
      duration_minutes: paper.duration_minutes,
    },
    questions: questions ?? [],
    sources: sources ?? [],
    saved: saved ?? [],
  });
}

async function save(
  service: ReturnType<typeof createClient>,
  userId: string,
  body: Json,
) {
  const attemptId = body.attempt_id;
  const entries = body.answers;
  if (typeof attemptId !== "string" || !Array.isArray(entries)) {
    return json({ error: "bad request" }, 400);
  }
  if (entries.length === 0 || entries.length > MAX_SAVE_BATCH) {
    return json({ error: "bad request" }, 400);
  }

  const { data: attempt } = await service
    .from("attempts").select("*").eq("id", attemptId).eq("user_id", userId).maybeSingle();
  if (!attempt) return json({ error: "not found" }, 404);
  if (attempt.status !== "in_progress") return json({ error: "attempt closed" }, 409);
  if (new Date(attempt.deadline as string).getTime() < Date.now()) {
    // Time is up — the server clock decides, not the client's.
    return json({ error: "time up" }, 409);
  }

  // Only accept answers for this paper's questions, with sane response shapes.
  const { data: questions } = await service
    .from("questions").select("id, qtype").eq("paper_id", attempt.paper_id);
  const qtypeById = new Map((questions ?? []).map((q) => [q.id as string, q.qtype as string]));

  const rows = [];
  for (const entry of entries) {
    const qid = (entry as Json)?.question_id;
    const response = (entry as Json)?.response as Json | undefined;
    if (typeof qid !== "string" || !qtypeById.has(qid) || !response) continue;
    const qtype = qtypeById.get(qid);
    if (qtype === "mcq") {
      if (typeof response.choice !== "number") continue;
      rows.push({ attempt_id: attemptId, question_id: qid, response: { choice: response.choice } });
    } else {
      if (typeof response.text !== "string") continue;
      rows.push({
        attempt_id: attemptId,
        question_id: qid,
        response: { text: response.text.slice(0, MAX_TEXT_LEN) },
      });
    }
  }
  if (rows.length) {
    const { error } = await service
      .from("answers")
      .upsert(rows.map((r) => ({ ...r, saved_at: new Date().toISOString() })), {
        onConflict: "attempt_id,question_id",
      });
    if (error) return json({ error: "save failed" }, 500);
  }
  return json({ ok: true, saved: rows.length, server_now: new Date().toISOString() });
}

async function submit(
  service: ReturnType<typeof createClient>,
  userId: string,
  body: Json,
) {
  const attemptId = body.attempt_id;
  if (typeof attemptId !== "string") return json({ error: "bad request" }, 400);

  const { data: attempt } = await service
    .from("attempts").select("*").eq("id", attemptId).eq("user_id", userId).maybeSingle();
  if (!attempt) return json({ error: "not found" }, 404);

  const late = attempt.status === "in_progress" &&
    new Date(attempt.deadline as string).getTime() < Date.now();
  const finalized = await markAndSubmit(service, attemptId, late);
  return json({ ok: true, attempt: finalized });
}

async function result(
  service: ReturnType<typeof createClient>,
  userId: string,
  body: Json,
) {
  const attemptId = body.attempt_id;
  if (typeof attemptId !== "string") return json({ error: "bad request" }, 400);

  const { data: attempt } = await service
    .from("attempts").select("*").eq("id", attemptId).eq("user_id", userId).maybeSingle();
  if (!attempt) return json({ error: "not found" }, 404);
  if (attempt.status !== "submitted") return json({ error: "not submitted" }, 409);

  const [{ data: paper }, { data: questions }, { data: sources }, { data: answers }] =
    await Promise.all([
      service.from("papers")
        .select("id, chapter_id, title, total_marks, objective_marks, duration_minutes")
        .eq("id", attempt.paper_id).single(),
      // Post-submit the keys and schemes are revealed — the attempt is closed.
      service.from("questions")
        .select("id, position, section_label, qtype, marks, prompt, hint, source_id, options, correct_index, scheme")
        .eq("paper_id", attempt.paper_id)
        .order("position"),
      service.from("paper_sources").select("source_id, title, body").eq("paper_id", attempt.paper_id),
      service.from("answers")
        .select("question_id, response, is_correct, marks_awarded, marking")
        .eq("attempt_id", attemptId),
    ]);

  return json({
    attempt: {
      id: attempt.id,
      status: attempt.status,
      started_at: attempt.started_at,
      submitted_at: attempt.submitted_at,
      auto_submitted: attempt.auto_submitted,
      objective_awarded: attempt.objective_awarded,
      objective_max: attempt.objective_max,
    },
    paper,
    questions: questions ?? [],
    sources: sources ?? [],
    answers: answers ?? [],
  });
}

// ============================================================
// admin actions
// ============================================================

interface AuthoredQuestion {
  section_label: string;
  qtype: "mcq" | "text";
  marks: number;
  prompt: string;
  source_id?: string;
  options?: string[];
  correct_index?: number;
  scheme?: { model_answer?: string; points?: { point: string; marks: number }[] };
  hint?: string;
}

interface AuthoredPaper {
  id: string;
  chapter_id: string;
  title: string;
  description?: string;
  duration_minutes: number;
  position?: number;
  sources?: { source_id: string; title?: string; body: string }[];
  questions: AuthoredQuestion[];
}

function validatePaper(p: unknown): { ok: true; paper: AuthoredPaper } | { ok: false; error: string } {
  const paper = p as AuthoredPaper;
  if (!paper || typeof paper !== "object") return { ok: false, error: "paper must be an object" };
  if (!validSlug(paper.id)) return { ok: false, error: "id must be a slug like c10-hist-ch2-p1" };
  if (!validSlug(paper.chapter_id)) return { ok: false, error: "chapter_id must be a slug like c10-hist-ch2" };
  if (typeof paper.title !== "string" || !paper.title.trim()) return { ok: false, error: "title is required" };
  if (
    typeof paper.duration_minutes !== "number" ||
    paper.duration_minutes < 5 || paper.duration_minutes > 180
  ) return { ok: false, error: "duration_minutes must be 5–180" };
  if (!Array.isArray(paper.questions) || paper.questions.length < 1 || paper.questions.length > 100) {
    return { ok: false, error: "questions must have 1–100 entries" };
  }
  const sourceIds = new Set((paper.sources ?? []).map((s) => s.source_id));
  for (const s of paper.sources ?? []) {
    if (!validSlug(s.source_id)) return { ok: false, error: `bad source_id "${s.source_id}"` };
    if (typeof s.body !== "string" || !s.body.trim()) {
      return { ok: false, error: `source "${s.source_id}" has no body` };
    }
  }
  for (let i = 0; i < paper.questions.length; i++) {
    const q = paper.questions[i];
    const at = `question ${i + 1}`;
    if (q.qtype !== "mcq" && q.qtype !== "text") return { ok: false, error: `${at}: qtype must be mcq or text` };
    if (typeof q.marks !== "number" || q.marks < 1 || q.marks > 10) {
      return { ok: false, error: `${at}: marks must be 1–10` };
    }
    if (typeof q.prompt !== "string" || !q.prompt.trim()) return { ok: false, error: `${at}: prompt is required` };
    if (typeof q.section_label !== "string" || !q.section_label.trim()) {
      return { ok: false, error: `${at}: section_label is required` };
    }
    if (q.source_id && !sourceIds.has(q.source_id)) {
      return { ok: false, error: `${at}: source_id "${q.source_id}" not in sources` };
    }
    if (q.hint !== undefined && (typeof q.hint !== "string" || q.hint.length > 600)) {
      return { ok: false, error: `${at}: hint must be text up to 600 characters` };
    }
    if (q.qtype === "mcq") {
      if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6) {
        return { ok: false, error: `${at}: mcq needs 2–6 options` };
      }
      if (
        typeof q.correct_index !== "number" ||
        q.correct_index < 0 || q.correct_index >= q.options.length
      ) return { ok: false, error: `${at}: correct_index out of range` };
    } else {
      if (!q.scheme?.model_answer) {
        return { ok: false, error: `${at}: text questions need scheme.model_answer (the marking scheme)` };
      }
    }
  }
  return { ok: true, paper };
}

async function upsertPaper(service: ReturnType<typeof createClient>, body: Json) {
  const check = validatePaper(body.paper);
  if (!check.ok) return json({ error: check.error }, 400);
  const p = check.paper;

  const totalMarks = p.questions.reduce((s, q) => s + q.marks, 0);
  const objectiveMarks = p.questions.filter((q) => q.qtype === "mcq")
    .reduce((s, q) => s + q.marks, 0);

  // Keep existing status on re-upload; new papers land as drafts.
  const { data: existing } = await service
    .from("papers").select("status").eq("id", p.id).maybeSingle();

  const { error: paperErr } = await service.from("papers").upsert({
    id: p.id,
    chapter_id: p.chapter_id,
    title: p.title.trim(),
    description: p.description?.trim() || null,
    duration_minutes: p.duration_minutes,
    position: p.position ?? 1,
    total_marks: totalMarks,
    objective_marks: objectiveMarks,
    question_count: p.questions.length,
    status: existing?.status ?? "draft",
    updated_at: new Date().toISOString(),
  });
  if (paperErr) return json({ error: "paper write failed", detail: paperErr.message }, 500);

  // Destructive replace of questions/sources (cascades old answers for this
  // paper — the admin UI warns before re-uploading a paper with attempts).
  await service.from("questions").delete().eq("paper_id", p.id);
  await service.from("paper_sources").delete().eq("paper_id", p.id);

  if (p.sources?.length) {
    const { error } = await service.from("paper_sources").insert(
      p.sources.map((s) => ({
        paper_id: p.id,
        source_id: s.source_id,
        title: s.title?.trim() || null,
        body: s.body,
      })),
    );
    if (error) return json({ error: "sources write failed", detail: error.message }, 500);
  }

  const { error: qErr } = await service.from("questions").insert(
    p.questions.map((q, i) => ({
      paper_id: p.id,
      position: i + 1,
      section_label: q.section_label.trim(),
      qtype: q.qtype,
      marks: q.marks,
      prompt: q.prompt.trim(),
      source_id: q.source_id ?? null,
      options: q.qtype === "mcq" ? q.options : null,
      correct_index: q.qtype === "mcq" ? q.correct_index : null,
      scheme: q.scheme ?? null,
      hint: q.hint?.trim() || null,
    })),
  );
  if (qErr) return json({ error: "questions write failed", detail: qErr.message }, 500);

  return json({
    ok: true,
    paper_id: p.id,
    status: existing?.status ?? "draft",
    total_marks: totalMarks,
    objective_marks: objectiveMarks,
    question_count: p.questions.length,
  });
}

async function getPaperAdmin(service: ReturnType<typeof createClient>, body: Json) {
  if (!validSlug(body.paper_id)) return json({ error: "bad request" }, 400);
  const [{ data: paper }, { data: questions }, { data: sources }] = await Promise.all([
    service.from("papers").select("*").eq("id", body.paper_id).maybeSingle(),
    service.from("questions").select("*").eq("paper_id", body.paper_id).order("position"),
    service.from("paper_sources").select("*").eq("paper_id", body.paper_id),
  ]);
  if (!paper) return json({ error: "not found" }, 404);
  return json({ paper, questions: questions ?? [], sources: sources ?? [] });
}

async function setStatus(service: ReturnType<typeof createClient>, body: Json) {
  if (!validSlug(body.paper_id)) return json({ error: "bad request" }, 400);
  if (body.status !== "draft" && body.status !== "published") {
    return json({ error: "bad request" }, 400);
  }
  const { error } = await service
    .from("papers")
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq("id", body.paper_id);
  if (error) return json({ error: "update failed" }, 500);
  return json({ ok: true });
}

async function deletePaper(service: ReturnType<typeof createClient>, body: Json) {
  if (!validSlug(body.paper_id)) return json({ error: "bad request" }, 400);
  const { error } = await service.from("papers").delete().eq("id", body.paper_id);
  if (error) return json({ error: "delete failed" }, 500);
  return json({ ok: true });
}

async function adminList(service: ReturnType<typeof createClient>) {
  const { data: papers } = await service
    .from("papers").select("*").order("chapter_id").order("position");
  const { data: counts } = await service
    .from("attempts").select("paper_id");
  const attemptCounts: Record<string, number> = {};
  for (const a of counts ?? []) {
    const pid = a.paper_id as string;
    attemptCounts[pid] = (attemptCounts[pid] ?? 0) + 1;
  }
  return json({ papers: papers ?? [], attempt_counts: attemptCounts });
}
