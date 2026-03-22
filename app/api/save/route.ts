import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { content, title, template } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Resume content is required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    // Attempt full insert first
    let { data, error } = await supabase
      .from('resumes')
      .insert([{ 
        content: content,
        user_id: user.id,
        title: title || 'Synthetic Profile',
        template: template || 'modern'
      }])
      .select();

    // Fallback for legacy tables without title/template columns
    if (error) {
      console.warn('Full insert failed, attempting legacy insert:', error.message);
      const fallback = await supabase
        .from('resumes')
        .insert([{ 
          content: content,
          user_id: user.id 
        }])
        .select();
      
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.error('Final Supabase Error:', error);
      return NextResponse.json({ error: 'Critical: Failed to save to database. Check table schema.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
