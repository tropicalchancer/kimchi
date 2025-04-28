/**********************************************************************
 *  /pages/api/auth/zupass/index.ts
 *  -------------------------------------------------------------------
 *  REST verify — GoTrue only accepts { type, token_hash }
 *********************************************************************/

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { ZKEdDSAEventTicketPCDPackage } from '@pcd/zk-eddsa-event-ticket-pcd';
import { isZupassPublicKey } from 'zuauth';
import { getRandomValues, hexToBigInt, toHexString } from '@pcd/util';

/* ───────────  Supabase clients  ─────────── */

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

/* ───────────  Router  ─────────── */

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET')  return res.json({ nonce: randHex() });
  if (req.method === 'POST') return login(req, res);
  res.status(405).end();
}

const randHex = () =>
  hexToBigInt(toHexString(getRandomValues(30))).toString();

/* ───────────  POST /login  ─────────── */
async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { pcd } = req.body;
    if (!pcd) return res.status(400).json({ error: 'No PCD supplied' });

    /* 1 ▸ verify Zupass proof */
    const proof = await ZKEdDSAEventTicketPCDPackage.deserialize(pcd);
    if (!(await ZKEdDSAEventTicketPCDPackage.verify(proof)))
      return res.status(401).json({ error: 'Invalid PCD' });
    if (!isZupassPublicKey(proof.claim.signer))
      return res.status(401).json({ error: 'Invalid signer' });

    const email = proof.claim.partialTicket.attendeeEmail;
    if (!email) return res.status(400).json({ error: 'Email not revealed' });

    /* 2 ▸ upsert profile (public.users) */
    const user = await upsert(
      proof.claim.nullifierHash ?? '',
      email,
      proof.claim.partialTicket.eventId ?? null,
      proof.claim.partialTicket
    );

    /* 3 ▸ ensure auth.users */
    const { data: list } = await admin.auth.admin.listUsers();
    if (!list.users.find(u => u.email?.toLowerCase() === email.toLowerCase())) {
      await admin.auth.admin.createUser({
        email,
        email_confirm : true,
        user_metadata : { zupass: true }
      });
    }

    /* 4 ▸ magic-link → REST verify */
    const { data: linkData, error } =
      await admin.auth.admin.generateLink({ type: 'magiclink', email });

    if (error || !linkData?.properties?.action_link)
      return res.status(500).json({ error: 'Failed to create link' });

    const params    = new URL(linkData.properties.action_link as string)
                        .searchParams;
    const tokenHash = params.get('token_hash') ?? params.get('token');

    const verifyRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/verify`,
      {
        method : 'POST',
        headers: {
          apikey       : process.env.SUPABASE_SERVICE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY!}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type      : 'magiclink',
          token_hash: tokenHash        // ← ONLY these two keys
        })
      }
    );

    if (!verifyRes.ok) {
      const detail = await verifyRes.text();
      console.error('[VERIFY FAIL]', detail);
      return res.status(500).json({ error: 'REST verify failed', detail });
    }

    const { access_token, refresh_token } = await verifyRes.json();

    return res.status(200).json({ user, access_token, refresh_token });
  } catch (e) {
    console.error('[Zupass login error]', e);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

/* ───────────  helper: upsert profile  ─────────── */
async function upsert(
  ticketId: string,
  email: string,
  eventId: string | null,
  metadata: any
) {
  const { data: byTicket } = await db
    .from('users').select('*').eq('ticket_id', ticketId).single();
  if (byTicket) {
    return (
      await db.from('users')
        .update({ last_login: new Date().toISOString(), metadata })
        .eq('id', byTicket.id)
        .select().single()
    ).data;
  }

  const { data: byEmail } = await db
    .from('users').select('*').eq('email', email).single();
  if (byEmail) {
    return (
      await db.from('users')
        .update({
          ticket_id : ticketId,
          event_id  : eventId,
          last_login: new Date().toISOString(),
          metadata
        })
        .eq('id', byEmail.id)
        .select().single()
    ).data;
  }

  return (
    await db.from('users').insert({
      ticket_id : ticketId,
      event_id  : eventId,
      email,
      last_login: new Date().toISOString(),
      metadata
    }).select().single()
  ).data;
}
