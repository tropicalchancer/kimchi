'use client'

/* ────────────────────────────────────────────────────────────────────
   useZupassAuth hook  🚀
   -------------------------------------------------------------------
   Handles the entire Zupass → Kimchi login lifecycle:

     1. GET /api/auth/zupass        → receive a nonce
     2. Open Zupass popup           → user signs proof (PCD)
     3. POST PCD back to the API    → API verifies + upserts Supabase
     4. Expose { user, login, … }   → any UI can consume the state
     5. Redirect to /feed on success
   ----------------------------------------------------------------- */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useZuAuth } from 'zuauth';
import { EdDSATicketFieldsToReveal } from '@pcd/zk-eddsa-event-ticket-pcd';

/* ────────────────  CONFIG  ─────────────────────────────────────── */

const ZUPASS_URL = 'https://zupass.org'; // reserved for future customisation

// What parts of the ticket we want Zupass to reveal
const defaultTicketFields: EdDSATicketFieldsToReveal = {
  revealTicketId:            false,
  revealEventId:             true,
  revealProductId:           true,
  revealTimestampConsumed:   false,
  revealTimestampSigned:     false,
  revealAttendeeSemaphoreId: false,
  revealIsConsumed:          false,
  revealIsRevoked:           false,
  revealTicketCategory:      false,
  revealAttendeeEmail:       true,
  revealAttendeeName:        false
};

/* ────────────────  HOOK  ───────────────────────────────────────── */

export function useZupassAuth() {
  const router = useRouter();                 // client-side navigation helper
  const { authenticate, pcd } = useZuAuth();  // Zupass helper

  const [user,      setUser]      = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  /* ---------------------------------------------------------------
     If zuauth emits a freshly-signed PCD, verify it immediately
  ----------------------------------------------------------------*/
  useEffect(() => {
    if (pcd) void handleLogin(pcd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pcd]);

  /* ─────────────  LOGIN BUTTON HANDLER  ───────────────────────── */

  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);

      /* 1. Ask our API for a nonce (anti-replay) */
      const r = await fetch('/api/auth/zupass', { method: 'GET' });
      const { nonce } = await r.json();

      /* 2. Launch Zupass popup */
      authenticate(defaultTicketFields, nonce);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  /* ─────────────  VERIFY PCD WITH BACKEND  ────────────────────── */

  const handleLogin = async (pcd: string) => {
    try {
      setIsLoading(true);
      setError(null);

      /* 3. Send proof to backend for verification */
      const res = await fetch('/api/auth/zupass', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ pcd })
      });
      if (!res.ok) throw new Error('Authentication failed');

      const { user } = await res.json();
      setUser(user);

      /* 4. 🚀 Redirect to /feed
            First attempt a soft push; if something blocks it,
            fall back to a hard reload so the user still lands there. */
      try {
        router.push('/feed');
      } finally {
        // hard redirect is a no-op if the soft push already succeeded
        window.location.assign('/feed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify authentication');
    } finally {
      setIsLoading(false);
    }
  };

  /* ─────────────  LOGOUT  ─────────────────────────────────────── */

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await fetch('/api/auth/zupass', { method: 'DELETE' });
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  /* ─────────────  PUBLIC API  ─────────────────────────────────── */

  return { user, login, logout, isLoading, error };
}
