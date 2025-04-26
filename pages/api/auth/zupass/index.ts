import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { ZKEdDSAEventTicketPCDPackage } from '@pcd/zk-eddsa-event-ticket-pcd';
import { isZupassPublicKey } from 'zuauth';
import { getRandomValues, hexToBigInt, toHexString } from '@pcd/util';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!           // keep your existing var name
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return handleNonce(req, res);
    case 'POST':
      return handleLogin(req, res);
    case 'DELETE':
      return handleLogout(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

/* ------------------------------------------------------------------ */
/*  NONCE                                                             */
/* ------------------------------------------------------------------ */
async function handleNonce(_: NextApiRequest, res: NextApiResponse) {
  try {
    const nonce = hexToBigInt(toHexString(getRandomValues(30))).toString();
    res.status(200).json({ nonce });
  } catch (error: any) {
    console.error('[ERROR] Nonce generation failed:', error);
    res.status(500).json({ error: 'Failed to generate nonce' });
  }
}

/* ------------------------------------------------------------------ */
/*  LOGIN / PCD VERIFY                                                */
/* ------------------------------------------------------------------ */
async function handleLogin(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { pcd } = req.body;
    if (!pcd) return res.status(400).json({ error: 'No PCD specified' });

    // 1 — deserialize & verify proof
    const verifiedPcd = await ZKEdDSAEventTicketPCDPackage.deserialize(pcd);
    if (!(await ZKEdDSAEventTicketPCDPackage.verify(verifiedPcd))) {
      return res.status(401).json({ error: 'Invalid PCD' });
    }
    if (!isZupassPublicKey(verifiedPcd.claim.signer)) {
      return res.status(401).json({ error: 'Invalid signer' });
    }

    // 2 — extract user–relevant fields
    const email     = verifiedPcd.claim.partialTicket.attendeeEmail;
    const ticketId  = verifiedPcd.claim.nullifierHash;
    const eventId   = verifiedPcd.claim.partialTicket.eventId;
    const metadata  = verifiedPcd.claim.partialTicket;

    // 3 — upsert in DB
    const user = await handleUserDatabase(ticketId, email, eventId, metadata);

    return res.status(200).json({ user });
  } catch (error: any) {
    console.error('[ERROR] Login failed:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

/* ------------------------------------------------------------------ */
/*  USER UPSERT LOGIC                                                 */
/* ------------------------------------------------------------------ */
async function handleUserDatabase(
  ticketId: string,
  email: string | undefined,
  eventId: string | undefined,
  metadata: any
) {
  /* 1. look by ticket ------------------------------------------------ */
  const { data: existingUserByTicket } = await supabase
    .from('users')
    .select('*')
    .eq('ticket_id', ticketId)
    .single();

  if (existingUserByTicket) {
    const { data: updated } = await supabase
      .from('users')
      .update({
        last_login: new Date().toISOString(),
        metadata
      })
      .eq('id', existingUserByTicket.id)
      .select()
      .single();
    return updated;
  }

  /* 2. (optional) look by email ------------------------------------- */
  if (email) {
    const { data: existingUserByEmail } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUserByEmail) {
      const { data: updated } = await supabase
        .from('users')
        .update({
          ticket_id: ticketId,
          event_id:  eventId,
          last_login: new Date().toISOString(),
          metadata
        })
        .eq('id', existingUserByEmail.id)
        .select()
        .single();
      return updated;
    }
  }

  /* 3. create new ---------------------------------------------------- */
  const { data: created } = await supabase
    .from('users')
    .insert({
      ticket_id: ticketId,
      event_id:  eventId,
      email:     email ?? null,               // avoid undefined
      last_login: new Date().toISOString(),
      metadata
    })
    .select()
    .single();

  return created;
}

/* ------------------------------------------------------------------ */
/*  LOGOUT                                                            */
/* ------------------------------------------------------------------ */
async function handleLogout(_: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('[ERROR] Logout failed:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
}
