'use client';
import { useEffect, useRef } from 'react';
import { useTracker } from './TrackerProvider';

export function FilloutSessionBridge({ iframeSelector = 'iframe[src*="fillout.com"]' }: { iframeSelector?: string }) {
  const { getSessionId } = useTracker();
  const injectedRef = useRef(false);
  useEffect(() => {
    if (injectedRef.current) return;
    const inject = () => {
      const iframe = document.querySelector(iframeSelector) as HTMLIFrameElement | null;
      if (!iframe) return false;
      const sessionId = getSessionId();
      if (!sessionId) return false;
      const params = new URLSearchParams(window.location.search);
      const src = new URL(iframe.src);
      src.searchParams.set('llh_sid', sessionId);
      ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(k => {
        const v = params.get(k); if (v) src.searchParams.set(k, v);
      });
      src.searchParams.set('landing_page', window.location.pathname);
      iframe.src = src.toString();
      injectedRef.current = true;
      return true;
    };
    if (!inject()) {
      const interval = setInterval(() => { if (inject()) clearInterval(interval); }, 200);
      const timeout = setTimeout(() => clearInterval(interval), 3000);
      return () => { clearInterval(interval); clearTimeout(timeout); };
    }
  }, [getSessionId, iframeSelector]);
  return null;
}

export function FilloutHiddenFields() {
  const { getSessionId } = useTracker();
  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId) return;
    const params = new URLSearchParams(window.location.search);
    params.set('llh_sid', sessionId);
    params.set('landing_page', window.location.pathname);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}${window.location.hash}`);
  }, [getSessionId]);
  return null;
}
