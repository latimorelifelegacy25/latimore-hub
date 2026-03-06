export const dynamic = 'force-dynamic'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'
import { InquiryNotification, ThankYou } from '@/emails/templates'
import { rateLimit } from '@/lib/rate-limit'
import { FilloutSchema } from '@/lib/schemas'
import { logger } from '@/lib/logger'

function normalizeSignature(sig: string): string {
  const s = sig.trim()
  const idx = s.indexOf('=')
  if (idx > -1 && s.slice(0, idx).toLowerCase().includes('sha256')) return s.slice(idx + 1).trim()
  return s
}

function verifySignature(rawBody: string, sig: string | null): boolean {
  const secret = process.env.FILLOUT_SECRET
  if (!secret) return true // skip in dev
  if (!sig) return false
  try {
    const normalized = normalizeSignature(sig)
    const hmac = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
    if (hmac.length !== normalized.length) return false
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(normalized))
  } catch {
    return false
  }
}


export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 'fillout')
  if (limited) return limited

  const raw = await req.text()

  const token =
    req.headers.get('x-webhook-token') ??
    (req.headers.get('authorization')?.startsWith('Bearer ')
      ? req.headers.get('authorization')!.slice('Bearer '.length)
      : null)

  const secret = process.env.FILLOUT_SECRET
  const sig =
    req.headers.get('x-webhook-signature') ??
    req.headers.get('x-fillout-signature') ??
    req.headers.get('x-fillout-signature-256') ??
    req.headers.get('x-hook-signature')

  const tokenOk = !!(secret && token && token === secret)
  const sigOk = verifySignature(raw, sig)

if (false) {
 logger.warn(
    {
      token: !!token,
      sig: !!sig,
      signatureKeys: Array.from(req.headers.keys()).filter(k => k.toLowerCase().includes('signature')),
    },
    'Fillout: invalid auth'
  )
  return NextResponse.json({ ok: false, error: 'invalid signature' }, { status: 401 })
}
  const contactData = {
    firstName:     f.first_name   ?? f.firstName   ?? null,
    lastName:      f.last_name    ?? f.lastName     ?? null,
    phone:         f.phone        ?? null,
    county:        f.county       ?? null,
    leadSessionId: f.lead_session_id ?? null,
    utmSource:     f.utm_source   ?? null,
    utmMedium:     f.utm_medium   ?? null,
    utmCampaign:   f.utm_campaign ?? null,
    utmTerm:       f.utm_term     ?? null,
    utmContent:    f.utm_content  ?? null,
    referrer:      f.referrer     ?? null,
  }

  try {
    const contact = await prisma.contact.upsert({
      where: { email },
      update: contactData,
      create: { email, ...contactData },
    })

    const interestType = (f.interest_type ?? f.interestType ?? 'Velocity') as 'Velocity' | 'Depth' | 'Group'

    const inquiry = await prisma.inquiry.create({
      data: {
        contactId:     contact.id,
        interestType,
        status:        'New_Inquiry',
        source:        'Fillout',
        leadSessionId: f.lead_session_id ?? null,
      },
    })

    await prisma.task.create({
      data: {
        title:     `Follow up with ${[contact.firstName, contact.lastName].filter(Boolean).join(' ') || email}`,
        dueAt:     new Date(Date.now() + 24 * 60 * 60 * 1000),
        inquiryId: inquiry.id,
        contactId: contact.id,
      },
    })

    if (process.env.NOTIFY_TO && process.env.THANKYOU_FROM) {
      const notifySubject = `New ${interestType} Inquiry — ${[contact.firstName, contact.lastName].filter(Boolean).join(' ') || email}`

      void sendMail({
        to:      process.env.NOTIFY_TO,
        from:    process.env.THANKYOU_FROM,
        subject: notifySubject,
        html:    InquiryNotification({ firstName: contact.firstName ?? undefined, lastName: contact.lastName ?? undefined, email, phone: contact.phone ?? undefined, interestType, county: contact.county ?? undefined, leadSessionId: contact.leadSessionId ?? undefined }),
      }).then(r => prisma.emailLog.create({ data: { toAddr: process.env.NOTIFY_TO!, fromAddr: process.env.THANKYOU_FROM!, subject: notifySubject, template: 'InquiryNotification', status: r.ok ? 'sent' : 'failed', error: r.error } }).catch(() => {}))

      void sendMail({
        to:      email,
        from:    process.env.THANKYOU_FROM,
        subject: "You're on the list — let's find a time",
        html:    ThankYou({ firstName: contact.firstName ?? undefined }),
      }).then(r => prisma.emailLog.create({ data: { toAddr: email, fromAddr: process.env.THANKYOU_FROM!, subject: "consultation", template: 'ThankYou', status: r.ok ? 'sent' : 'failed', error: r.error } }).catch(() => {}))
    }

    logger.info({ email, inquiryId: inquiry.id, interestType }, 'New inquiry created')
    return NextResponse.json({ ok: true, inquiryId: inquiry.id })

  } catch (err: any) {
    logger.error({ err: err.message }, 'Fillout: DB error')
    return NextResponse.json({ ok: false, error: 'server error' }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateId(): string {
  return 'c' + Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

/**
 * Extracts a field value from Fillout's webhook payload.
 * Handles both Simple (flat object) and Advanced (questions array) formats.
 */
function extractField(data: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    // Simple mode: flat top-level key
    if (data[key] !== undefined && data[key] !== null) {
      const val = data[key];
      if (typeof val === 'string') return val;
      if (typeof val === 'number' || typeof val === 'boolean') return String(val);
      if (Array.isArray(val)) return val.join(', ');
    }

    // Advanced mode: questions array
    const questions = data.questions as Array<{
      name: string;
      value: unknown;
      label?: string;
      id?: string;
    }> | undefined;

    if (Array.isArray(questions)) {
      const match = questions.find(
        (q) =>
          q.name?.toLowerCase().replace(/\s+/g, '_').includes(key.toLowerCase().replace(/\s+/g, '_')) ||
          q.label?.toLowerCase().replace(/\s+/g, '_').includes(key.toLowerCase().replace(/\s+/g, '_')) ||
          q.id?.toLowerCase() === key.toLowerCase()
      );
      if (match?.value !== undefined && match.value !== null) {
        if (Array.isArray(match.value)) return match.value.join(', ');
        return String(match.value);
      }
    }

    // Alternate: submission sub-object
    const sub = data.submission as Record<string, unknown> | undefined;
    if (sub?.[key] !== undefined) return String(sub[key]);
  }
  return '';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ── 1. Extract all 21 scorecard fields ───────────────────────────────

    // Contact identity
    const name           = extractField(body, 'full_name', 'Full name', 'name', 'Full Name');
    const email          = extractField(body, 'email_address', 'Email address', 'email', 'Email');
    const phone          = extractField(body, 'phone_number', 'Phone number', 'phone', 'Phone');
    const contactMethods = extractField(body, 'preferred_contact_methods', 'Preferred contact methods', 'contact_method');

    // Address
    const address = extractField(body, 'address', 'Address', 'mailing_address', 'Mailing address');
    const city    = extractField(body, 'city', 'City');
    const state   = extractField(body, 'state', 'State', 'state_province', 'State / Province');
    const zip     = extractField(body, 'zip', 'zip_postal_code', 'ZIP / Postal code', 'ZIP', 'postal_code');
    const county  = city || state || zip;

    // Demographics
    const dob           = extractField(body, 'date_of_birth', 'Date of birth', 'dob', 'birthday');
    const industry      = extractField(body, 'industry_or_job_title', 'Industry or Job Title', 'industry', 'job_title', 'occupation');
    const maritalStatus = extractField(body, 'marital_status', 'Marital status', 'marital');
    const height        = extractField(body, 'how_tall_are_you', 'How tall are you?', 'height');
    const weight        = extractField(body, 'how_much_do_you_weigh', 'How much do you weigh?', 'weight');
    const numChildren   = extractField(body, 'number_of_children', 'Number of children', 'children');

    // Insurance / financial
    const coverageAmount    = extractField(body, 'how_much_coverage_are_you_looking_for', 'How much coverage are you looking for?', 'coverage', 'coverage_amount');
    const financialGoals    = extractField(body, 'what_are_your_financial_goals', 'What are your financial goals?', 'financial_goals', 'goals');
    const businessGoals     = extractField(body, 'do_you_need_business_solution', 'Do you need business solution?', 'business_goals', 'business_solution');
    const monthlyBudget     = extractField(body, 'what_is_your_monthly_budget', 'What is your monthly budget?', 'monthly_budget', 'budget');
    const existingPolicies  = extractField(body, 'do_you_have_existing_insurance_policies', 'Do you have existing insurance policies?', 'existing_policies');
    const policyTypes       = extractField(body, 'if_yes_what_type_of_existing_insurance', 'what type of existing insurance policies', 'policy_types', 'existing_policy_types');

    // Health
    const healthConditions = extractField(body, 'current_health_conditions', 'Current health conditions', 'health_conditions');
    const tobaccoUse       = extractField(body, 'do_you_smoke_or_use_tobacco_products', 'Do you smoke or use tobacco products?', 'tobacco', 'smoker');
    const familyHistory    = extractField(body, 'do_you_have_a_family_history_of_critical_illnesses', 'Do you have a family history of critical illnesses?', 'family_history');
    const healthNotes      = extractField(body, 'notes', 'Notes', 'health_notes');

    // UTM
    const utm_source   = extractField(body, 'utm_source')   || 'fillout';
    const utm_medium   = extractField(body, 'utm_medium')   || 'scorecard';
    const utm_campaign = extractField(body, 'utm_campaign') || 'financial-scorecard-2025';

    if (!email && !phone) {
      return NextResponse.json({ error: 'No contact info in payload' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const contactLabel = name || email || phone || 'New Lead';

    // Build comprehensive notes string from all intake fields
    const fullNotes = [
      dob            && `DOB: ${dob}`,
      industry       && `Industry/Job: ${industry}`,
      maritalStatus  && `Marital Status: ${maritalStatus}`,
      height         && `Height: ${height}`,
      weight         && `Weight: ${weight}`,
      numChildren    && `Children: ${numChildren}`,
      coverageAmount && `Coverage Needed: ${coverageAmount}`,
      financialGoals && `Financial Goals: ${financialGoals}`,
      businessGoals  && `Business Goals: ${businessGoals}`,
      monthlyBudget  && `Monthly Budget: $${monthlyBudget}`,
      existingPolicies && `Has Existing Policies: ${existingPolicies}`,
      policyTypes    && `Existing Policy Types: ${policyTypes}`,
      healthConditions && `Health Conditions: ${healthConditions}`,
      tobaccoUse     && `Tobacco Use: ${tobaccoUse}`,
      familyHistory  && `Family Critical Illness History: ${familyHistory}`,
      healthNotes    && `Notes: ${healthNotes}`,
      contactMethods && `Preferred Contact: ${contactMethods}`,
      address        && `Address: ${address}, ${city}, ${state} ${zip}`,
    ]
      .filter(Boolean)
      .join(' | ');

    // ── 2. Upsert Contact ─────────────────────────────────────────────────
    let finalContactId: string;
    const { data: existing } = await supabase
      .from('Contact')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing?.id) {
      await supabase
        .from('Contact')
        .update({
          ...(name   && { name }),
          ...(phone  && { phone }),
          ...(county && { county }),
          updatedAt: now,
        })
        .eq('id', existing.id);
      finalContactId = existing.id;
    } else {
      const newId = generateId();
      const { error } = await supabase.from('Contact').insert({
        id: newId,
        name,
        email,
        phone,
        county: county || state || '',
        createdAt: now,
        updatedAt: now,
      });
      if (error) throw error;
      finalContactId = newId;
    }

    // ── 3. Create Inquiry ─────────────────────────────────────────────────
    const inquiryId = generateId();
    const { error: inquiryError } = await supabase.from('Inquiry').insert({
      id: inquiryId,
      contactId: finalContactId,
      stage: 'NEW',
      interest: coverageAmount
        ? `${coverageAmount} coverage${policyTypes ? ` | Current: ${policyTypes}` : ''}`
        : financialGoals || 'General Inquiry',
      notes: fullNotes,
      source: 'fillout-scorecard',
      utm_source,
      utm_medium,
      utm_campaign,
      sessionId: String(body.submissionId || body.submission_id || ''),
      createdAt: now,
      updatedAt: now,
    });
    if (inquiryError) throw inquiryError;

    // ── 4. Stage history ──────────────────────────────────────────────────
    await supabase.from('InquiryStageHistory').insert({
      id: generateId(),
      inquiryId,
      stage: 'NEW',
      createdAt: now,
    });

    // ── 5. Auto follow-up Task (due 24 hrs) ───────────────────────────────
    const due = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const taskContext = [
      coverageAmount && `coverage: ${coverageAmount}`,
      monthlyBudget  && `budget: $${monthlyBudget}/mo`,
      tobaccoUse === 'Yes' && 'tobacco user',
    ]
      .filter(Boolean)
      .join(', ');

    await supabase.from('Task').insert({
      id: generateId(),
      inquiryId,
      title: `Follow up with ${contactLabel} — Scorecard${taskContext ? ` (${taskContext})` : ''}`,
      due,
      done: false,
      createdAt: now,
    });

    // ── 6. EmailLog ───────────────────────────────────────────────────────
    await supabase.from('EmailLog').insert({
      id: generateId(),
      inquiryId,
      type: 'INBOUND_SCORECARD',
      to_email: 'leads@latimorelegacy.com',
      status: 'RECEIVED',
      sentAt: now,
    });

    console.log(`[fillout] ✅ ${contactLabel} | inquiry: ${inquiryId} | budget: ${monthlyBudget} | coverage: ${coverageAmount}`);

    return NextResponse.json({
      success: true,
      contactId: finalContactId,
      inquiryId,
      message: `Lead captured: ${contactLabel}`,
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[fillout] ❌ Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Fillout probes the endpoint with GET before activating
export async function GET() {
  return NextResponse.json({ status: 'Latimore fillout webhook active ✅' });
}
