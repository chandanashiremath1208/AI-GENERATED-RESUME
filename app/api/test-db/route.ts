import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Test 1: Can we connect to auth?
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    // Test 2: Can we read from public resumes table? (Will tell us if RL is blocking or missing table)
    const { data: dbData, error: dbError } = await supabase.from('resumes').select('id').limit(1);

    // Get current public URL configurations (safe to expose partial to self)
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return NextResponse.json({
      environment: {
        hasUrl: !!url,
        urlPreview: url ? `${url.substring(0, 15)}...` : null,
        hasAnonKey: hasAnonKey,
      },
      auth: {
        success: !authError,
        error: authError ? authError.message : null,
        sessionExists: !!authData.session
      },
      database: {
        success: !dbError,
        error: dbError ? dbError.message : null,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'CRITICAL DIAGNOSTIC FAILURE', 
      message: error.message 
    }, { status: 500 });
  }
}
