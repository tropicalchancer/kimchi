import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/shared/types/database'

export const createClient = () => createClientComponentClient<Database>() 