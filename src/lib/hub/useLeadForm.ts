'use client';
import { useState } from 'react';
import { useTracker } from '@/components/tracker/TrackerProvider';

export type LeadFormData = {
  firstName?: string; lastName?: string; email?: string;
  phone?: string; county?: string; productInterest?: string; notes?: string;
};

export type LeadFormState =
  | { status: 'idle' } | { status: 'submitting' }
  | { status: 'success'; contactId: string; inquiryId: string }
  | { status: 'error'; message: string };

const HUB_API = process.env.NEXT_PUBLIC_HUB_API_URL ?? 'https://latimorehub.vercel.app';

export function useLeadForm() {
  const [state, setState] = useState<LeadFormState>({ status: 'idle' });
  const { getSessionId, trackEvent } = useTracker();

  const submit = async (data: LeadFormData) => {
    setState({ status: 'submitting' });
    const params = new URLSearchParams(window.location.search);
    try {
      const res = await fetch(`${HUB_API}/api/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          leadSessionId: getSessionId(),
          source: params.get('utm_source'),
          medium: params.get('utm_medium'),
          campaign: params.get('utm_campaign'),
          term: params.get('utm_term'),
          content: params.get('utm_content'),
          referrer: document.referrer || null,
          landingPage: window.location.pathname,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) throw new Error(result.error ?? 'Submission failed');
      trackEvent({ eventType: 'formsubmit', county: data.county, productInterest: data.productInterest, metadata: { inquiryId: result.inquiryId } });
      setState({ status: 'success', contactId: result.contactId, inquiryId: result.inquiryId });
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setState({ status: 'error', message });
      throw err;
    }
  };

  return { state, submit, reset: () => setState({ status: 'idle' }) };
}
