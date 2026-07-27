// Public legal pages (Sprint 2 — Razorpay onboarding requires live ToS,
// Privacy and Refund pages). DRAFT wording — Uday to review before launch.
// Reachable signed-out (AuthGuard routes them) and signed-in (router routes).
function LegalShell({ title, updated, children }: {
  title: string
  updated: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh" style={{ background: 'linear-gradient(160deg, #FBEFE7 30%, #F1ECFA)' }}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <a href="/" className="font-display text-xl font-bold text-hist-dark no-underline">
          History<span style={{ color: '#DC835F' }}>Lab</span>
        </a>
        <div className="bg-white rounded-3xl shadow-card p-8 mt-6">
          <h1 className="font-display text-2xl font-bold text-hist-dark mb-1">{title}</h1>
          <p className="text-xs text-gray-400 font-body mb-6">Last updated: {updated}</p>
          <div className="font-body text-sm text-gray-600 leading-relaxed space-y-4 [&_h2]:font-display [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-hist-dark [&_h2]:mt-6 [&_h2]:mb-1">
            {children}
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 font-body mt-6">
          © 2026 Teknomatics (Pi By Two Tech Solutions Pvt. Ltd.) · historylab.in ·{' '}
          <a className="underline" href="mailto:info@teknomatics.com">info@teknomatics.com</a>
        </p>
      </div>
    </div>
  )
}

const UPDATED = '27 July 2026'

export function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated={UPDATED}>
      <p>
        HistoryLab (historylab.in) is an online learning service for school History, operated by
        <b> Pi By Two Tech Solutions Pvt. Ltd.</b> ("we", "us"). By creating an account or using
        HistoryLab you agree to these terms.
      </p>
      <h2>The service</h2>
      <p>
        HistoryLab provides interactive chapter content, study tools and practice tests aligned to
        the NCERT/CBSE curriculum. The first section of Chapter 1 is free; full chapters and the
        examiner-review add-on are one-time paid purchases tied to your account.
      </p>
      <h2>Accounts and parental consent</h2>
      <p>
        HistoryLab is used by school students, typically minors. Account creation assumes that
        there is consent from a parent/guardian. The registered email receives invoices, important
        account notices and (optionally) progress updates. Keep your account credentials safe;
        accounts are personal and may not be shared.
      </p>
      <h2>Purchases</h2>
      <p>
        Chapter purchases are one-time payments giving that account lifetime access to the chapter
        on HistoryLab. Prices are shown at checkout and include applicable taxes; Razorpay emails a
        payment receipt, and a GST invoice is available on request from{' '}
        <a href="mailto:info@teknomatics.com">info@teknomatics.com</a>. Payments are processed by
        Razorpay — we never see or store card details. All purchases are final — no refunds — as set out in our{' '}
        <a href="/refunds">Refund Policy</a>; the first section of Chapter 1 is free so you can
        judge the service before paying.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Don't attempt to copy, scrape, resell or redistribute chapter content; don't probe,
        overload or attempt to bypass access controls; don't submit abusive or unlawful content in
        answers. We may suspend accounts that violate these terms.
      </p>
      <h2>Content and intellectual property</h2>
      <p>
        HistoryLab's original content (story cards, questions, marking schemes, feedback and
        software) belongs to Teknomatics. NCERT textbook material referenced in the service belongs
        to its respective copyright holders and is used for educational purposes.
      </p>
      <h2>Service quality and liability</h2>
      <p>
        We work hard to keep HistoryLab accurate and available, but we provide it "as is" — we
        can't guarantee uninterrupted availability or specific exam outcomes. MCQs are marked
        automatically; written answers are self-checked against the marking scheme, unless you
        purchase an examiner review, in which case a Senior CBSE Examiner marks the paper
        personally. All marks are indicative — board marking may differ. Our
        total liability for any claim is limited to the amount you paid us in the 12 months before
        the claim.
      </p>
      <h2>Changes and contact</h2>
      <p>
        We may update these terms; material changes will be notified to the registered email.
        These terms are governed by the laws of India. Questions:{' '}
        <a href="mailto:info@teknomatics.com">info@teknomatics.com</a>.
      </p>
    </LegalShell>
  )
}

export function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated={UPDATED}>
      <p>
        HistoryLab (historylab.in) is built for students, so we collect the minimum and never
        monetise data. Operated by <b>Pi By Two Tech Solutions Pvt. Ltd.</b>
      </p>
      <h2>What we collect</h2>
      <p>
        Name, email and profile photo from Google sign-in; class and school name (as entered);
        parent/guardian email and consent timestamp; study progress (sections completed, flashcard
        schedule, practice scores and written answers); device/usage logs needed to run and secure
        the service. That's it.
      </p>
      <h2>What we never do</h2>
      <p>
        No advertising, no ad-tracking, no selling or renting of data, no profiling of minors
        beyond their own study progress, and no sharing with third parties except the processors
        below.
      </p>
      <h2>Who processes the data</h2>
      <p>
        Your data and activity on HistoryLab.in are stored in our service database, sign-in is via
        Google, and payments are via Razorpay (we never see card details). Papers submitted for
        examiner review are marked personally by our human examiner — no AI service processes your
        child's answers.
      </p>
      <h2>Parents' rights</h2>
      <p>
        The parent/guardian on an account can ask us to export or delete the account and all its
        data — email <a href="mailto:info@teknomatics.com">info@teknomatics.com</a> from the
        registered email address and we'll complete it within 7 days. Deleting the account removes
        progress and entitlements permanently.
      </p>
      <h2>Retention and security</h2>
      <p>
        We keep account data while the account is active and purchase/invoice records as required
        by law. Data is encrypted in transit, access is restricted, and backups are kept for
        disaster recovery only.
      </p>
      <h2>Changes and contact</h2>
      <p>
        Material changes to this policy are notified to the parent/guardian email. Questions:{' '}
        <a href="mailto:info@teknomatics.com">info@teknomatics.com</a>.
      </p>
    </LegalShell>
  )
}

export function RefundPage() {
  return (
    <LegalShell title="Refund Policy" updated={UPDATED}>
      <h2>All purchases are final — no refunds</h2>
      <p>
        HistoryLab purchases — chapter unlocks and examiner reviews — are one-time payments and
        are <b>not refundable</b> once made. Instead of a refund window, we let you judge the
        product before paying: the first section of Chapter 1 is completely free, with no card
        and no trial timer.
      </p>
      <h2>Examiner review add-on</h2>
      <p>
        Examiner reviews are likewise <b>not refundable</b>. Each review is a personal marking
        service — a Senior CBSE Examiner hand-marks the submitted paper — so once the fee is paid
        it cannot be cancelled or refunded. Please submit a paper for review only when you are
        sure. This is also stated at checkout.
      </p>
      <h2>Failed or duplicate payments</h2>
      <p>
        If money was deducted but your purchase did not unlock, or you were charged twice for the
        same purchase, that is a payment error — not a refund request. Email{' '}
        <a href="mailto:info@teknomatics.com">info@teknomatics.com</a> with the payment reference and
        we will reverse the erroneous charge via Razorpay to the original payment method within
        5–7 working days.
      </p>
      <h2>No subscriptions — nothing to cancel</h2>
      <p>
        There are no subscriptions on HistoryLab, so there is nothing to cancel — every purchase is
        one-time. You can stop using the service at any time, and the parent/guardian can request
        account deletion under our <a href="/privacy">Privacy Policy</a>.
      </p>
      <h2>Contact</h2>
      <p>
        <a href="mailto:info@teknomatics.com">info@teknomatics.com</a> — include the account email and
        the invoice number from the purchase email.
      </p>
    </LegalShell>
  )
}
