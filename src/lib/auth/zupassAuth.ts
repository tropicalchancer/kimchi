'use client'

/**********************************************************************
 *  useZupassAuth hook   —  Zupass + Supabase session
 *********************************************************************/

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useZuAuth } from 'zuauth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { EdDSATicketFieldsToReveal } from '@pcd/zk-eddsa-event-ticket-pcd';

/* ────────────────  CONFIG  ─────────────────────────────────────── */

const supabase = createClientComponentClient();

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
  const router = useRouter();
  const { authenticate, pcd } = useZuAuth();

  const [user,      setUser]      = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  /*  handle proof whenever the popup sends it back */
  useEffect(() => {
    if (pcd) void verifyPCD(pcd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pcd]);

  /* ─────────────  LOGIN  ───────────────────────── */

  const login = async () => {
    try {
      setIsLoading(true); setError(null);

      const r = await fetch('/api/auth/zupass', { method: 'GET' });
      const { nonce } = await r.json();

      authenticate(defaultTicketFields, nonce);   // opens popup
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  /* ─────────────  VERIFY & SET SESSION  ───────────────────────── */

  const verifyPCD = async (pcd: string) => {
    try {
      setIsLoading(true); setError(null);

      const res = await fetch('/api/auth/zupass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:   JSON.stringify({ pcd })
      });
      if (!res.ok) throw new Error('Authentication failed');

      const { user, access_token, refresh_token } = await res.json();

      /* store Supabase session locally */
      await supabase.auth.setSession({ access_token, refresh_token });

      setUser(user);
      router.push('/feed');          // guards now succeed
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify authentication');
    } finally {
      setIsLoading(false);
    }
  };

  /* ─────────────  LOGOUT  ───────────────────────── */

  const logout = async () => {
    try {
      setIsLoading(true); setError(null);
      await fetch('/api/auth/zupass', { method: 'DELETE' });
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout');
    } finally {
      setIsLoading(false);
    }
  };

  return { user, login, logout, isLoading, error };
}
