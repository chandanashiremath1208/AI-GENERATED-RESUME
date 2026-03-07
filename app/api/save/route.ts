import { NextResponse } from 'next/server';
import { createSupabaseClient } from '@/utils/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Resume content is required' }, { status: 400 });
    }

    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('resumes')
      .insert([
        { content: content }
      ])
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: 'Failed to save to database' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
