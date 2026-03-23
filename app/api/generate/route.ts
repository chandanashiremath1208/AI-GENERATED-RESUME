import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, phone, role, summary, experience, education, skills, template } = body;

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "HTTP-Referer": req.headers.get('origin') || 'https://ai-generated-resume-rho.vercel.app/',
        "X-Title": 'AI Resume Builder (Elevate)',
      }
    });

    const models = [
      "google/gemini-2.0-flash-lite-preview-02-05:free",
      "google/gemma-2-9b-it:free",
      "mistralai/mistral-7b-instruct:free"
    ];

    let lastError = null;
    let completion = null;

    for (const model of models) {
      try {
        console.log(`Trying AI Model: ${model}`);
        completion = await openai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: "You are an expert resume parser and writer. You output strictly raw JSON matching the requested schema." },
            { role: "user", content: `
              You are an expert professional resume writer.
              Take these inputs and create a highly professional, JSON-only resume.
              User: { name: "${name}", role: "${role}", experience: "${experience}", education: "${education}", skills: "${skills}" }
              Template: ${template}
              
              Return ONLY a JSON object matching this schema:
              { "name": "", "role": "", "contact": [], "summary": "", "experience": [], "education": [], "skills": [] }
            ` }
          ],
          temperature: 0.6,
        });
        if (completion) break;
      } catch (err: any) {
        console.error(`Model ${model} failed:`, err.message);
        lastError = err;
      }
    }

    if (!completion) {
      return NextResponse.json({ 
        error: `AI Synthesis Failed across all nodes. Last Error: ${lastError?.message || 'Unknown'}` 
      }, { status: 500 });
    }

    let resumeContent = completion.choices[0]?.message?.content || "";
    
    // Clean up markdown wrapping
    resumeContent = resumeContent.trim();
    if (resumeContent.startsWith("```json")) {
      resumeContent = resumeContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (resumeContent.startsWith("```")) {
      resumeContent = resumeContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    return NextResponse.json({ resume: resumeContent });

  } catch (error: any) {
    console.error('Error in generate route:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
