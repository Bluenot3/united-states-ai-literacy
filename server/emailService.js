/**
 * ZEN Vanguard — Email Service (Resend)
 *
 * Handles all transactional emails. Configure RESEND_API_KEY in your .env
 * to enable sending. If the key is absent, emails are logged instead of sent
 * (safe for local development without a Resend account).
 */

import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'ZEN Vanguard <noreply@zenai.world>';
const REPLY_TO  = process.env.RESEND_REPLY_TO  || 'support@zenai.world';

// ─── Design tokens (kept in JS so templates are self-contained) ────────────
const t = {
    bg:        '#060B18',
    surface:   '#0F172A',
    card:      '#111827',
    border:    'rgba(201,168,76,0.15)',
    gold:      '#C9A84C',
    goldLight: '#DFC06A',
    cyan:      '#22D3EE',
    emerald:   '#34D399',
    text:      '#E8ECF4',
    muted:     '#94A3B8',
    dimmed:    '#64748B',
};

// ─── Shared wrapper ────────────────────────────────────────────────────────
function layout(bodyContent) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title>ZEN Vanguard</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: ${t.bg};
      color: ${t.text};
      -webkit-font-smoothing: antialiased;
    }
    a { color: ${t.gold}; text-decoration: none; }
    a:hover { color: ${t.goldLight}; }
    .wrapper { width: 100%; background: ${t.bg}; padding: 40px 16px; }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: ${t.card};
      border-radius: 20px;
      border: 1px solid ${t.border};
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #0a0f1e 0%, #0d1528 100%);
      padding: 36px 40px 30px;
      border-bottom: 1px solid ${t.border};
      text-align: center;
    }
    .logo-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 52px; height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, ${t.gold}, ${t.goldLight});
      font-size: 22px; font-weight: 900;
      color: #060B18;
      margin-bottom: 14px;
    }
    .brand { font-size: 11px; font-weight: 700; letter-spacing: 0.35em; text-transform: uppercase; color: ${t.gold}; }
    .body { padding: 40px; }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(201,168,76,0.08);
      border: 1px solid rgba(201,168,76,0.2);
      border-radius: 100px;
      padding: 6px 16px;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.2em; text-transform: uppercase;
      color: ${t.gold};
      margin-bottom: 24px;
    }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: ${t.emerald}; display: inline-block; }
    h1 { font-size: 26px; font-weight: 800; line-height: 1.25; color: ${t.text}; margin-bottom: 16px; }
    h1 span { background: linear-gradient(90deg, ${t.gold}, ${t.goldLight}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p { font-size: 15px; line-height: 1.7; color: ${t.muted}; margin-bottom: 16px; }
    .btn {
      display: inline-block;
      margin: 24px 0;
      padding: 14px 32px;
      background: linear-gradient(135deg, ${t.gold}, ${t.goldLight});
      color: #060B18 !important;
      font-size: 14px; font-weight: 800;
      border-radius: 100px;
      text-decoration: none;
      letter-spacing: 0.03em;
    }
    .card {
      background: ${t.surface};
      border: 1px solid ${t.border};
      border-radius: 14px;
      padding: 24px;
      margin: 24px 0;
    }
    .card-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .card-row:last-child { border-bottom: none; }
    .card-label { font-size: 12px; color: ${t.dimmed}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
    .card-value { font-size: 14px; color: ${t.text}; font-weight: 700; }
    .divider { height: 1px; background: ${t.border}; margin: 28px 0; }
    .checklist { list-style: none; padding: 0; margin: 0; }
    .checklist li { display: flex; align-items: flex-start; gap: 12px; padding: 8px 0; font-size: 14px; color: ${t.muted}; }
    .check-icon { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; background: rgba(52,211,153,0.15); border: 1px solid rgba(52,211,153,0.3); display: flex; align-items: center; justify-content: center; font-size: 10px; color: ${t.emerald}; margin-top: 1px; }
    .cert-badge {
      text-align: center;
      background: linear-gradient(135deg, rgba(201,168,76,0.06), rgba(201,168,76,0.02));
      border: 1px solid rgba(201,168,76,0.2);
      border-radius: 16px;
      padding: 32px;
      margin: 24px 0;
    }
    .cert-icon { font-size: 48px; margin-bottom: 16px; }
    .cert-name { font-size: 18px; font-weight: 800; color: ${t.text}; margin-bottom: 8px; }
    .cert-id { font-size: 11px; font-family: 'Courier New', monospace; color: ${t.dimmed}; background: rgba(255,255,255,0.04); padding: 4px 12px; border-radius: 6px; display: inline-block; }
    .footer {
      background: ${t.surface};
      border-top: 1px solid ${t.border};
      padding: 28px 40px;
      text-align: center;
    }
    .footer p { font-size: 12px; color: ${t.dimmed}; margin-bottom: 4px; }
    .footer a { color: ${t.dimmed}; font-size: 12px; }
    .footer a:hover { color: ${t.gold}; }
    @media (max-width: 600px) {
      .body { padding: 28px 24px; }
      .header { padding: 28px 24px 22px; }
      .footer { padding: 24px; }
      h1 { font-size: 22px; }
    }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="container">
    <div class="header">
      <div class="logo-mark">Z</div>
      <div class="brand">ZEN Vanguard</div>
    </div>
    <div class="body">
      ${bodyContent}
    </div>
    <div class="footer">
      <p>ZEN Vanguard · AI Professionals Program</p>
      <p style="margin-top:6px">The professional evolution of the first verified AI literacy program in U.S. history.</p>
      <p style="margin-top:12px"><a href="#">Unsubscribe</a> &nbsp;·&nbsp; <a href="#">Privacy Policy</a></p>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ─── Email templates ───────────────────────────────────────────────────────

export function buildWelcomeEmail({ name, email }) {
    const displayName = name || email.split('@')[0] || 'Pioneer';

    const body = `
      <div class="hero-badge"><span class="dot"></span> Welcome to ZEN Vanguard</div>
      <h1>Welcome aboard, <span>${displayName}.</span></h1>
      <p>Your account is live. You now have access to the Program Hub and the full ZEN Vanguard curriculum — four progressive modules that take you from AI fundamentals to production-ready systems.</p>

      <div class="card">
        <div class="card-row">
          <span class="card-label">Account</span>
          <span class="card-value">${email}</span>
        </div>
        <div class="card-row">
          <span class="card-label">Program</span>
          <span class="card-value">ZEN Vanguard · Full Access</span>
        </div>
        <div class="card-row">
          <span class="card-label">Status</span>
          <span class="card-value" style="color:${t.emerald}">Active</span>
        </div>
      </div>

      <p style="font-weight:700;color:${t.text}">Your first move:</p>
      <ul class="checklist">
        <li><span class="check-icon">1</span>Open the <strong style="color:${t.text}">Starter Guide</strong> — the shortest path from zero to your first AI deployment.</li>
        <li><span class="check-icon">2</span>Launch <strong style="color:${t.text}">Module 1: AI Foundations</strong> — master the mental model before touching any tools.</li>
        <li><span class="check-icon">3</span>Complete interactive labs to earn XP and unlock your first module certificate.</li>
      </ul>

      <a class="btn" href="${process.env.APP_URL || 'https://app.zenai.world'}/hub">Go to Program Hub →</a>

      <div class="divider"></div>
      <p style="font-size:13px">Questions? Reply directly to this email — we're a small team and we read everything.</p>
    `;

    return {
        subject: `Welcome to ZEN Vanguard, ${displayName}`,
        html: layout(body),
        text: `Welcome to ZEN Vanguard, ${displayName}!\n\nYour account (${email}) is now active. Head to the Program Hub to get started: ${process.env.APP_URL || 'https://app.zenai.world'}/hub\n\nStart with the Starter Guide for the fastest path to your first AI deployment.\n\n— The ZEN Vanguard Team`,
    };
}

export function buildCertificateEmail({ name, email, moduleName, moduleNumber, certificateId, certificateHash }) {
    const displayName = name || email.split('@')[0] || 'Pioneer';
    const shortHash = certificateHash ? certificateHash.substring(0, 16) + '…' : 'N/A';
    const certUrl   = `${process.env.APP_URL || 'https://app.zenai.world'}/certificate/${certificateId}`;

    const body = `
      <div class="hero-badge"><span class="dot"></span> Certificate Earned</div>
      <h1>You completed <span>Module ${moduleNumber}.</span></h1>
      <p>Congratulations, ${displayName}. You've earned your certificate for <strong style="color:${t.text}">${moduleName}</strong>. Your achievement has been cryptographically verified and permanently recorded.</p>

      <div class="cert-badge">
        <div class="cert-icon">🏆</div>
        <div class="cert-name">${moduleName}</div>
        <div style="font-size:13px;color:${t.muted};margin:8px 0 12px">ZEN Vanguard Certification</div>
        <div class="cert-id">ID: ${certificateId}</div>
        <div class="cert-id" style="margin-top:6px">HASH: ${shortHash}</div>
      </div>

      <a class="btn" href="${certUrl}">View Your Certificate →</a>

      <div class="divider"></div>

      <p style="font-weight:700;color:${t.text}">What's next?</p>
      <ul class="checklist">
        <li><span class="check-icon">→</span>Share your certificate — the link is publicly verifiable.</li>
        <li><span class="check-icon">→</span>Continue to the next module to keep building.</li>
        <li><span class="check-icon">→</span>Complete all four modules to unlock your Final Vanguard Certification.</li>
      </ul>
    `;

    return {
        subject: `Certificate earned: ${moduleName} — ZEN Vanguard`,
        html: layout(body),
        text: `Congratulations ${displayName}!\n\nYou've earned your certificate for ${moduleName}.\n\nCertificate ID: ${certificateId}\nVerification Hash: ${certificateHash}\n\nView it here: ${certUrl}\n\n— The ZEN Vanguard Team`,
    };
}

export function buildFinalCertificateEmail({ name, email, certificateId, certificateHash }) {
    const displayName = name || email.split('@')[0] || 'Pioneer';
    const shortHash   = certificateHash ? certificateHash.substring(0, 16) + '…' : 'N/A';
    const certUrl     = `${process.env.APP_URL || 'https://app.zenai.world'}/certificate/${certificateId}`;

    const body = `
      <div class="hero-badge"><span class="dot"></span> Final Certification</div>
      <h1>You are a <span>ZEN Vanguard.</span></h1>
      <p>${displayName}, you've completed all four modules of the ZEN Vanguard program. This is the Final Vanguard Certification — the highest credential in the program and a testament to your mastery of modern AI systems.</p>

      <div class="cert-badge" style="background:linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.04));border-color:rgba(201,168,76,0.35)">
        <div class="cert-icon">⚡</div>
        <div class="cert-name" style="background:linear-gradient(90deg,${t.gold},${t.goldLight});-webkit-background-clip:text;-webkit-text-fill-color:transparent">Final Vanguard Certification</div>
        <div style="font-size:13px;color:${t.muted};margin:8px 0 12px">ZEN Vanguard · All Modules Complete</div>
        <div class="cert-id">ID: ${certificateId}</div>
        <div class="cert-id" style="margin-top:6px">HASH: ${shortHash}</div>
      </div>

      <a class="btn" href="${certUrl}" style="background:linear-gradient(135deg,${t.gold},${t.goldLight});box-shadow:0 0 40px rgba(201,168,76,0.3)">View Final Certificate →</a>

      <div class="divider"></div>
      <p style="font-size:13px">Your certification is publicly verifiable. Share the certificate link with anyone — it will always resolve to your authentic credential.</p>
    `;

    return {
        subject: `Final Vanguard Certification — You made it, ${displayName}`,
        html: layout(body),
        text: `Congratulations ${displayName}!\n\nYou've completed all four modules and earned your Final Vanguard Certification.\n\nCertificate ID: ${certificateId}\nVerification Hash: ${certificateHash}\n\nView it here: ${certUrl}\n\n— The ZEN Vanguard Team`,
    };
}

export function buildSubscriptionWelcomeEmail({ name, email }) {
    const displayName = name || email.split('@')[0] || 'Pioneer';

    const body = `
      <div class="hero-badge"><span class="dot"></span> Subscription Activated</div>
      <h1>Your subscription is <span>active.</span></h1>
      <p>Payment confirmed. Full access to ZEN Vanguard is now unlocked for <strong style="color:${t.text}">${email}</strong>.</p>

      <div class="card">
        <div class="card-row">
          <span class="card-label">Plan</span>
          <span class="card-value">ZEN Vanguard Full Access</span>
        </div>
        <div class="card-row">
          <span class="card-label">Billing</span>
          <span class="card-value">Monthly subscription via Stripe</span>
        </div>
        <div class="card-row">
          <span class="card-label">Status</span>
          <span class="card-value" style="color:${t.emerald}">Active</span>
        </div>
      </div>

      <ul class="checklist">
        <li><span class="check-icon">✓</span>All four AI learning modules — fully unlocked.</li>
        <li><span class="check-icon">✓</span>Interactive labs, simulations, and certification tracks.</li>
        <li><span class="check-icon">✓</span>Program Hub with guided learning paths.</li>
      </ul>

      <a class="btn" href="${process.env.APP_URL || 'https://app.zenai.world'}/hub">Enter the Program Hub →</a>
    `;

    return {
        subject: `Subscription confirmed — ZEN Vanguard is unlocked`,
        html: layout(body),
        text: `Your ZEN Vanguard subscription is now active, ${displayName}.\n\nHead to the Program Hub: ${process.env.APP_URL || 'https://app.zenai.world'}/hub\n\n— The ZEN Vanguard Team`,
    };
}

// ─── Send helper ───────────────────────────────────────────────────────────

/**
 * Send a transactional email via Resend.
 * Falls back to a console.log if RESEND_API_KEY is not configured.
 *
 * @param {string} to        Recipient email address
 * @param {object} template  { subject, html, text }
 * @returns {Promise<{ id: string }|null>}
 */
export async function sendEmail(to, template) {
    if (!resend) {
        console.log(`[EmailService] RESEND_API_KEY not set — would have sent "${template.subject}" to ${to}`);
        return null;
    }

    try {
        const { data, error } = await resend.emails.send({
            from:     FROM_EMAIL,
            reply_to: REPLY_TO,
            to:       [to],
            subject:  template.subject,
            html:     template.html,
            text:     template.text,
        });

        if (error) {
            console.error('[EmailService] Resend error:', error);
            return null;
        }

        console.log(`[EmailService] Sent "${template.subject}" to ${to} — id: ${data?.id}`);
        return data;
    } catch (err) {
        console.error('[EmailService] Unexpected send error:', err);
        return null;
    }
}
