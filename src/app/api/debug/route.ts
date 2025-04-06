import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get table info
    const { data: tableInfo, error: tableError } = await supabase
      .from('projects')
      .select('*')
      .limit(1)

    if (tableError) {
      return NextResponse.json({ error: tableError.message }, { status: 500 })
    }

    // Get RLS policies (this requires admin rights, may not work)
    const { data: metadata, error: metaError } = await supabase
      .rpc('get_table_info', { table_name: 'projects' })

    return NextResponse.json({
      table_data: tableInfo,
      metadata: metadata,
      error: metaError?.message
    })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
} 