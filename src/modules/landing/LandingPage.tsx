import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import './landing.css'

// Public landing page — faithful port of the FROZEN mockups/landing-v8.html,
// with copy updated for decision #26 (free tier = Ch1 Section 1, not the
// whole chapter) and live wiring: prices come from the products table, the
// class-interest + parent-newsletter forms write to their capture tables, and
// every CTA starts Google sign-in.
interface LandingPageProps {
  onSignIn: () => void
  signingIn?: boolean
}

interface PriceInfo {
  chapter: string
  chapterList: string | null
  examiner: string
}

const FALLBACK_PRICES: PriceInfo = { chapter: '₹499', chapterList: '₹799', examiner: '₹149' }

// Testimonials stay hidden until real pilot-student quotes (with permission) replace the placeholders.
const SHOW_PILOT_QUOTES = false

function rupees(paise: number): string {
  return `₹${(paise / 100).toFixed(0)}`
}

function EmailCapture({
  table,
  classLabel,
  placeholder,
  buttonLabel,
  small,
}: {
  table: 'class_interest' | 'parent_updates'
  classLabel?: string
  placeholder: string
  buttonLabel: string
  small?: boolean
}) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')

  const submit = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return
    setState('busy')
    const row =
      table === 'class_interest'
        ? { class_label: classLabel ?? 'unspecified', email: email.trim().toLowerCase() }
        : { email: email.trim().toLowerCase() }
    const { error } = await supabase.from(table).insert(row)
    // Duplicate signup (unique constraint) is a success from the user's side.
    setState(error && error.code !== '23505' ? 'error' : 'done')
  }

  if (state === 'done') {
    return <div className="formok">✓ You're on the list — we'll email you.</div>
  }
  return (
    <>
      <input
        type="email"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />
      <button
        className={`btn ${small ? 'btn-primary btn-sm' : 'btn-ghost'}`}
        onClick={submit}
        disabled={state === 'busy'}
      >
        {state === 'error' ? 'Try again' : buttonLabel}
      </button>
    </>
  )
}

function SignInModal({ open, onClose, onSignIn, signingIn }: {
  open: boolean
  onClose: () => void
  onSignIn: () => void
  signingIn?: boolean
}) {
  if (!open) return null
  return (
    <div className="modal-veil" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="brand" style={{ fontSize: 26 }}>
          History<span className="lab">Lab</span>
        </div>
        <p className="modal-sub">
          Sign in with your Google account — the first section of Chapter 1 is free, no card
          needed.
        </p>
        <button className="gbtn" onClick={onSignIn} disabled={signingIn}>
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {signingIn ? 'Opening Google…' : 'Continue with Google'}
        </button>
        <p className="modal-fine">
          By continuing you agree to our <a href="/terms">Terms</a> and{' '}
          <a href="/privacy">Privacy Policy</a>.
        </p>
        <button className="modal-close" onClick={onClose}>Not now</button>
      </div>
    </div>
  )
}

export function LandingPage({ onSignIn, signingIn }: LandingPageProps) {
  const [prices, setPrices] = useState<PriceInfo>(FALLBACK_PRICES)
  const [interestClass, setInterestClass] = useState('class-9')
  // ?signin=1 deep-links straight to the sign-in sheet (marketing links).
  const [showSignIn, setShowSignIn] = useState(
    () => new URLSearchParams(window.location.search).has('signin')
  )

  useEffect(() => {
    supabase
      .from('products')
      .select('id, kind, price_paise, list_price_paise, is_free')
      .eq('active', true)
      .then(({ data }) => {
        if (!data) return
        const chapter = data.find((p) => p.kind === 'chapter' && !p.is_free)
        const examiner = data.find((p) => p.kind === 'addon')
        setPrices({
          chapter: chapter ? rupees(chapter.price_paise) : FALLBACK_PRICES.chapter,
          chapterList: chapter?.list_price_paise ? rupees(chapter.list_price_paise) : null,
          examiner: examiner ? rupees(examiner.price_paise) : FALLBACK_PRICES.examiner,
        })
      })
  }, [])

  // Mobile-only sticky bottom CTA: appears the moment the hero's own
  // "Start learning free" button disappears (including behind the sticky
  // header — hence the negative top rootMargin), hidden again while the
  // final CTA band or footer is on screen (they carry their own CTA).
  // Desktop never renders the bar (display:none in CSS).
  const heroBtnRef = useRef<HTMLButtonElement>(null)
  const endRef = useRef<HTMLElement>(null)
  const footRef = useRef<HTMLElement>(null)
  const [stickyOn, setStickyOn] = useState(false)
  useEffect(() => {
    let btnGone = false
    let endOnScreen = false
    const update = () => setStickyOn(btnGone && !endOnScreen)

    const ioBtn = new IntersectionObserver(
      (entries) => {
        for (const e of entries) btnGone = !e.isIntersecting
        update()
      },
      // ~mobile header height: the button counts as gone once it slides under it.
      { rootMargin: '-56px 0px 0px 0px' }
    )
    if (heroBtnRef.current) ioBtn.observe(heroBtnRef.current)

    const vis = new Map<Element, boolean>()
    const ioEnd = new IntersectionObserver((entries) => {
      for (const e of entries) vis.set(e.target, e.isIntersecting)
      endOnScreen = [...vis.values()].some(Boolean)
      update()
    })
    ;[endRef.current, footRef.current]
      .filter((el): el is HTMLElement => el !== null)
      .forEach((el) => ioEnd.observe(el))

    return () => {
      ioBtn.disconnect()
      ioEnd.disconnect()
    }
  }, [])

  // CTAs open a branded sign-in sheet first — never a surprise redirect to
  // Google (Uday's feedback, 2026-07-12).
  const openSignIn = () => setShowSignIn(true)
  const start = (
    <button className="btn btn-primary btn-big" onClick={openSignIn}>
      Start learning free →
    </button>
  )

  return (
    <div className="landing">
      <div className="topbar">
        <div className="in">
          <div className="brand">
            History<span className="lab">Lab</span>
          </div>
          <nav>
            <a href="#how">How it works</a>
            <a href="#inside">Features</a>
            <a href="#examiner">Examiner</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="topact">
            <button className="btn btn-ghost btn-sm" onClick={openSignIn}>
              Sign in
            </button>
            <button className="btn btn-primary btn-sm" onClick={openSignIn}>
              Start free
            </button>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="band band-hero">
        <div className="in">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="kicker">
                <span>The home of school History</span>
                <span className="kdot" aria-hidden>
                  ·
                </span>
                <span>Live now: CBSE Class 10</span>
              </span>
              <h1>
                History,
                <br />
                <em>finally understood.</em>
              </h1>
              {/* The three statements + their proof lines, merged into icon
                  rows (2026-07-28 hero polish) — copy unchanged, emoji gone. */}
              <div className="creds">
                <div className="cred">
                  <span className="cic" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 4h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z" />
                      <path d="M22 4h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </span>
                  <div>
                    <b>Learn every chapter as an interactive story.</b>
                    <span>Built with a CBSE History teacher · every chapter NCERT-faithful</span>
                  </div>
                </div>
                <div className="cred">
                  <span className="cic" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="8" y="2" width="8" height="4" rx="1" />
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <path d="m9 14 2 2 4-4" />
                    </svg>
                  </span>
                  <div>
                    <b>Practice like the boards.</b>
                    <span>Papers, sources &amp; maps the way CBSE asks</span>
                  </div>
                </div>
                <div className="cred">
                  <span className="cic" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="6" />
                      <path d="M15.5 13 17 22l-5-3-5 3 1.5-9" />
                    </svg>
                  </span>
                  <div>
                    <b>
                      Get your paper <em>marked by a real CBSE examiner</em>.
                    </b>
                    <span>20 years of board marking behind every scheme</span>
                  </div>
                </div>
              </div>
              <div className="cta-row">
                <button
                  className="btn btn-primary btn-big"
                  onClick={openSignIn}
                  ref={heroBtnRef}
                >
                  Start learning free →
                </button>
              </div>
              <div className="herochips">
                <span className="hchip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6l8-3 8 3z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  First section free · no card needed
                </span>
                <span className="hdiv" aria-hidden />
                <a className="hchip hlink" href="#pricing">
                  See pricing →
                </a>
              </div>
            </div>
            <img
              className="heroipad"
              src="/landing/hero-ipad.png"
              alt="HistoryLab on an iPad — a chapter as an illustrated, interactive story"
            />
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="band band-tint">
        <div className="in">
          <div className="bhead">
            <span className="kicker">The problem</span>
            <h2>History feels hard. Because it's taught the wrong way.</h2>
          </div>
          <div className="probs">
            <div className="prob">
              <div className="illo">
                <img src="/landing/illo-memorise.webp" alt="A student overwhelmed by dates and books" />
              </div>
              <div className="tt">
                <b>Too much to memorise</b>
                <p>"He reads the chapter twice and remembers nothing."</p>
              </div>
            </div>
            <div className="prob">
              <div className="illo">
                <img src="/landing/illo-connect.webp" alt="A student unable to connect historical events" />
              </div>
              <div className="tt">
                <b>Hard to connect</b>
                <p>"She memorises everything — and forgets it in the exam."</p>
              </div>
            </div>
            <div className="prob">
              <div className="illo">
                <img src="/landing/illo-panic.webp" alt="A student panicking before exams" />
              </div>
              <div className="tt">
                <b>Panic before exams</b>
                <p>"Boards are coming, and History is the subject we fight about."</p>
              </div>
            </div>
          </div>
          <div className="founder">
            <p>
              We built HistoryLab to make history{' '}
              <em>easy to understand, easy to remember, and easy to score.</em>
            </p>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="band" id="how">
        <div className="in">
          <div className="bhead">
            <span className="kicker">The HistoryLab way</span>
            <h2>From story to score, in four steps</h2>
          </div>
          <div className="jgrid">
            <div className="jstep">
              <div className="jhead">
                <div className="jnum">1</div>
                <div>
                  <b>Read the story</b>
                  <span>Story cards that make every concept clear.</span>
                </div>
              </div>
              <div className="mini">
                <img src="/landing/shot-timeline.png" alt="Story and revision cards" />
              </div>
            </div>
            <div className="jstep">
              <div className="jhead">
                <div className="jnum">2</div>
                <div>
                  <b>Answer like the boards</b>
                  <span>Write real answers to board-style questions.</span>
                </div>
              </div>
              <div className="mini">
                <div className="pad">
                  <span className="mlbl">2-mark question</span>
                  <div className="q">Why did Gandhiji withdraw the Non-Cooperation Movement?</div>
                  <div className="mans">
                    Because the movement turned violent at Chauri Chaura, and Gandhiji felt
                    satyagrahis needed training…
                  </div>
                  <span className="mbtn">Submit answer</span>
                </div>
              </div>
            </div>
            <div className="jstep">
              <div className="jhead">
                <div className="jnum">3</div>
                <div>
                  <b>Get marked by the examiner</b>
                  <span>Real marks and remarks on your written paper, point by point.</span>
                </div>
              </div>
              <div className="mini">
                <div className="pad">
                  <span className="mlbl">Your score</span>
                  <div className="mscore">2 / 2</div>
                  <div className="mpt">
                    <span className="m m-ok">✓</span>
                    <span>
                      <b>+1</b> Chauri Chaura violence named
                    </span>
                  </div>
                  <div className="mpt">
                    <span className="m m-ok">✓</span>
                    <span>
                      <b>+1</b> Gandhiji's reasoning explained
                    </span>
                  </div>
                  <div className="mnote">
                    <b>Marker's note:</b> Full marks — cause and reasoning both covered.
                  </div>
                </div>
              </div>
            </div>
            <div className="jstep">
              <div className="jhead">
                <div className="jnum">4</div>
                <div>
                  <b>Improve and ace</b>
                  <span>Feedback shows exactly how to write better.</span>
                </div>
              </div>
              <div className="mini">
                <div className="pad">
                  <span className="mlbl">Your progress</span>
                  <div className="graph">
                    <div className="gbar" style={{ height: '44%' }}>
                      <span>52%</span>
                    </div>
                    <div className="gbar" style={{ height: '62%' }}>
                      <span>65%</span>
                    </div>
                    <div className="gbar" style={{ height: '78%' }}>
                      <span>74%</span>
                    </div>
                    <div className="gbar" style={{ height: '96%' }}>
                      <span>85%</span>
                    </div>
                  </div>
                  <div className="gcap">
                    <i>Paper 1</i>
                    <i>Paper 2</i>
                    <i>Paper 3</i>
                    <i>Paper 4</i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="band band-tint" id="inside">
        <div className="in">
          <div className="bhead">
            <h2>Everything you need to master History</h2>
            <p>All of it inside every chapter. Nothing extra to buy, nothing to print.</p>
          </div>
          <div className="tools">
            <div className="tool">
              <div className="ic" style={{ background: 'var(--ls4-bg)' }}>🃏</div>
              <div>
                <b>Smart flashcards</b>
                <span>Spaced-repetition revision</span>
              </div>
            </div>
            <div className="tool">
              <div className="ic" style={{ background: 'var(--ls3-bg)' }}>📅</div>
              <div>
                <b>Timelines</b>
                <span>Every key date, in order</span>
              </div>
            </div>
            <div className="tool">
              <div className="ic" style={{ background: 'var(--ls6-bg)' }}>🗺️</div>
              <div>
                <b>Interactive maps</b>
                <span>Tap. Explore. Label.</span>
              </div>
            </div>
            <div className="tool">
              <div className="ic" style={{ background: 'var(--ls5-bg)' }}>🖼️</div>
              <div>
                <b>NCERT figures</b>
                <span>Tap-hotspots &amp; exam tips</span>
              </div>
            </div>
            <div className="tool">
              <div className="ic" style={{ background: 'var(--ls2-bg)' }}>📜</div>
              <div>
                <b>Primary sources</b>
                <span>Analysed, exam-ready</span>
              </div>
            </div>
            <div className="tool">
              <div className="ic" style={{ background: 'var(--ls1-bg)' }}>🧠</div>
              <div>
                <b>Practice quizzes</b>
                <span>MCQ, match, fill-in, T/F</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXAMINER */}
      <section className="band" id="examiner">
        <div className="in">
          <div className="ex-grid">
            <div className="ex-copy">
              <span className="kicker" style={{ color: 'var(--pen)' }}>
                The red pen behind HistoryLab
              </span>
              <h2>
                A <em>Senior CBSE Examiner</em> stands behind every mark.
              </h2>
              <p>
                Anyone can build a portal with AI. We built ours around a person: HistoryLab has
                onboarded a <b>Senior CBSE Examiner with 20 years of teaching and board-marking
                experience</b> — and every paper, marking scheme and remark carries their red pen.
              </p>
              <ul>
                <li>Every paper and marking scheme is authored by the examiner</li>
                <li>MCQs are marked instantly, on every attempt, unlimited retries</li>
                <li>
                  Send any paper for the examiner's personal marking — {prices.examiner}, back
                  within 72 hours
                </li>
              </ul>
            </div>
            <div className="redcard">
              <span className="stamp">Reviewed by a Senior CBSE Examiner</span>
              <div className="q">Q7 · Rich peasants in the Civil Disobedience Movement (3 marks)</div>
              <div className="rline">
                <span className="rm">✓ +1</span>
                <span>Trade depression &amp; falling prices — communities named, well attributed.</span>
              </div>
              <div className="rline">
                <span className="rm">✓ +1</span>
                <span>Revenue demand impossible to pay — correct and crisp.</span>
              </div>
              <div className="rline">
                <span className="rm">✗ 0</span>
                <span>Third point answers a different question — direction slip.</span>
              </div>
              <div className="rnote">
                <p>
                  "A neat, well-ordered answer — you clearly know the chapter. You dropped the
                  third mark by drifting to a different group. Anchor every point to the exact
                  group the question names."
                </p>
                <span>Examiner's remark · returned within 72 hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="band band-lav">
        <div className="in">
          <div className="bhead">
            <h2>Active learning. Real understanding. Better results.</h2>
            <p>"But there are free videos on YouTube…" — there are. Here's the difference.</p>
          </div>
          <div className="cmp">
            <div className="row head">
              <div className="cell">Videos &amp; notes</div>
              <div className="cell hl">HistoryLab</div>
            </div>
            <div className="row">
              <div className="cell">Passive watching</div>
              <div className="cell hl">Interactive stories</div>
            </div>
            <div className="row">
              <div className="cell">One explanation, then you're alone</div>
              <div className="cell hl">Practice on every concept</div>
            </div>
            <div className="row">
              <div className="cell">No feedback on written answers</div>
              <div className="cell hl">A real CBSE examiner's red pen on your written paper</div>
            </div>
            <div className="row">
              <div className="cell">Hard to remember</div>
              <div className="cell hl">Built to revise — flashcards &amp; spaced repetition</div>
            </div>
            <div className="row">
              <div className="cell">Generic content</div>
              <div className="cell hl">NCERT-exact · board-pattern · examiner-authored</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — hidden until real pilot-student quotes replace the placeholder ones.
          Flip to true after swapping in genuine quotes (names used with permission). */}
      {SHOW_PILOT_QUOTES && (
      <section className="band band-ink">
        <div className="in">
          <div className="bhead">
            <h2>From the pilot classroom</h2>
            <p>Class 10 students in Gurugram used HistoryLab before anyone else.</p>
          </div>
          <div className="quotes">
            <div className="quote">
              <p>
                "I actually understand WHY things happened now, instead of memorising dates. The
                story mode doesn't feel like studying."
              </p>
              <div className="who">
                <div className="av" style={{ background: 'var(--ls2)' }}>A</div>
                <div>
                  <b>Ananya</b>
                  <span>Class 10 student</span>
                </div>
              </div>
            </div>
            <div className="quote">
              <p>
                "The figures section saved me — I could never remember what each painting meant.
                Now I can explain Sorrieu in the exam."
              </p>
              <div className="who">
                <div className="av" style={{ background: 'var(--ls4)' }}>R</div>
                <div>
                  <b>Rohan</b>
                  <span>Class 10 student</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ROADMAP */}
      <section className="band">
        <div className="in">
          <div className="bhead">
            <h2>One home for school History</h2>
            <p>We're building every class, one brilliant chapter at a time.</p>
          </div>
          <div className="classes">
            <div className="cls live">
              <div className="ic" style={{ background: 'var(--accent-soft)' }}>🏛️</div>
              <div>
                <b>Class 10 — LIVE</b>
                <span>India and the Contemporary World-II · 2 chapters live, 3 in the works.</span>
              </div>
            </div>
            <div className="cls">
              <div className="ic" style={{ background: 'var(--lav-soft)' }}>🗿</div>
              <div>
                <b>Class 9 — next</b>
                <span>Same story-mode, same examiner-backed marking.</span>
              </div>
            </div>
            <div className="cls">
              <div className="ic" style={{ background: 'var(--ls6-bg)' }}>🌏</div>
              <div>
                <b>Classes 6–8 — coming</b>
                <span>The full NCERT History journey.</span>
              </div>
            </div>
          </div>
          <div className="notify">
            <div className="f">
              <label>Not in Class 10 yet? Your class + parent's email</label>
              <select value={interestClass} onChange={(e) => setInterestClass(e.target.value)}>
                <option value="class-9">Class 9</option>
                <option value="class-8">Class 8</option>
                <option value="class-7">Class 7</option>
                <option value="class-6">Class 6</option>
              </select>
            </div>
            <EmailCapture
              table="class_interest"
              classLabel={interestClass}
              placeholder="parent@example.com"
              buttonLabel="Tell me when my class arrives"
            />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="band band-tint" id="pricing">
        <div className="in">
          <div className="bhead">
            <h2>Simple pricing. No subscriptions.</h2>
            <p>Pay once per chapter, keep it forever.</p>
          </div>
          <div className="price-grid">
            <div className="price">
              <h3>Start free</h3>
              <div className="amt">₹0</div>
              <ul>
                <li>The first section of Chapter 1, full story mode</li>
                <li>Figures, maps &amp; timeline for the section</li>
                <li>Smart flashcards</li>
                <li>No card, no trial timer — judge us first</li>
              </ul>
            </div>
            <div className="price hot">
              <span className="tag">Launch price · Best value</span>
              <h3>Any chapter</h3>
              <div className="amt">
                {prices.chapterList && <span className="strike">{prices.chapterList}</span>}
                {prices.chapter} <small>one-time</small>
              </div>
              <ul>
                <li>The complete chapter + every study tool</li>
                <li>
                  <b>Board-pattern test papers</b>
                </li>
                <li>
                  <b>Instant MCQ marking · unlimited attempts</b>
                </li>
                <li>Lifetime access · receipt on email</li>
              </ul>
            </div>
            <div className="price addon">
              <span className="tag">Add-on · per paper</span>
              <h3>Examiner's personal review</h3>
              <div className="amt">
                {prices.examiner} <small>per paper</small>
              </div>
              <ul>
                <li>
                  <b>A Senior CBSE Examiner reviews your written paper</b>
                </li>
                <li>Point-by-point marks + remarks, against the official marking scheme</li>
                <li>Returned within 72 hours</li>
                <li>Buy only when you want it</li>
              </ul>
            </div>
          </div>
          <div className="safety">
            <div className="chip">🚫 <b>No ads, ever</b></div>
            <div className="chip">🔒 <b>No data sharing</b></div>
            <div className="chip">🧾 <b>GST invoice on request</b></div>
            <div className="chip">🆓 <b>Try free before you pay</b></div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="band" id="faq">
        <div className="in">
          <div className="bhead">
            <h2>Questions parents ask us</h2>
            <p>The honest answers.</p>
          </div>
          <div className="faq">
            <details open>
              <summary>Is HistoryLab really free to start?</summary>
              <p>
                Yes — the first section of Chapter 1 is completely free: the full story mode plus
                its figures, maps, timeline and flashcards. No card details, no trial timer. Judge
                the quality before paying a rupee; unlock the rest of the chapter only if it earns
                it.
              </p>
            </details>
            <details>
              <summary>Which board and classes does this cover?</summary>
              <p>
                CBSE Class 10 History is live today (NCERT "India and the Contemporary World-II").
                Class 9 is next, then Classes 6–8. Leave your email above and we'll tell you the
                day your class arrives.
              </p>
            </details>
            <details>
              <summary>How does the answer marking work?</summary>
              <p>
                Your child writes answers to board-pattern questions. MCQs are checked instantly,
                with unlimited re-attempts. For written answers, the{' '}
                <b>Senior CBSE Examiner</b> we've onboarded (20 years of board experience)
                personally marks the paper — point-by-point against the exact marking scheme,
                with remarks on every answer — returned within 72 hours ({prices.examiner} per
                paper).
              </p>
            </details>
            <details>
              <summary>How is this different from tuition or YouTube?</summary>
              <p>
                Videos and tuition explain the chapter. HistoryLab makes your child <i>do</i> the
                chapter — read actively, practise maps and figures, write real answers and see
                exactly where marks are lost. At {prices.chapter} per chapter, it costs less than a
                single tuition class.
              </p>
            </details>
            <details>
              <summary>Does it work on phone, tablet and laptop?</summary>
              <p>
                Yes — HistoryLab runs in the browser on all three. Progress syncs to the account,
                so your child can read on a phone and practise papers on a laptop.
              </p>
            </details>
            <details>
              <summary>Is my child's data safe?</summary>
              <p>
                We store only a first name, emails and study progress. No ads, no tracking for
                advertising, no selling of data. Full details in our Privacy Policy — written in
                plain language, for parents.
              </p>
            </details>
            <details>
              <summary>What if it doesn't work for my child?</summary>
              <p>
                That's exactly why the first section of Chapter 1 is completely free — no card, no
                trial timer. Let your child judge it fully before you pay. Purchases are one-time
                and final, and if anything ever doesn't work as promised, write to
                info@teknomatics.com and we'll make it right.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="band band-cta" ref={endRef}>
        <div className="in">
          <h2>The first section is free. Start tonight.</h2>
          <p>
            The Rise of Nationalism in Europe — story mode, figures, maps and flashcards. The
            textbook, finally brought to life.
          </p>
          {start}
        </div>
      </section>

      <footer ref={footRef}>
        <div className="in">
          <div className="fgrid">
            <div>
              <div className="brand" style={{ fontSize: 20 }}>
                History<span className="lab">Lab</span>
              </div>
              <div className="tagline">
                The home of school History. Easy to understand, easy to remember, easy to score.
              </div>
            </div>
            <div>
              <h4>Explore</h4>
              <a href="#how">How it works</a>
              <a href="#inside">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="mailto:info@teknomatics.com">Contact</a>
              <a href="/terms">Terms of Service</a>
              <a href="/privacy">Privacy Policy</a>
              <a href="/refunds">Refund Policy</a>
            </div>
          </div>
          <div className="fbase">
            <span>© 2026 Teknomatics (Pi By Two Tech Solutions Pvt. Ltd.) · historylab.in</span>
            <span>Made with ❤️ for students</span>
          </div>
        </div>
      </footer>

      {/* Mobile-only sticky CTA bar (desktop: display none) */}
      <div className={`stickycta${stickyOn ? ' on' : ''}`} aria-hidden={!stickyOn}>
        <button
          className="btn btn-primary"
          onClick={openSignIn}
          tabIndex={stickyOn ? 0 : -1}
        >
          Start learning free →
        </button>
        <span>No card needed · The first section is really free</span>
      </div>

      <SignInModal
        open={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSignIn={onSignIn}
        signingIn={signingIn}
      />
    </div>
  )
}
