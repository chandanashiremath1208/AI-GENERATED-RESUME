import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const keyPrefix = apiKey ? apiKey.substring(0, 10) : 'MISSING';

  if (!apiKey || apiKey === 'your_anon_key_here') {
    return NextResponse.json({ 
      error: 'CRITICAL: OpenRouter API Key is missing or default in Vercel settings.',
      troubleshooting: 'Please go to Vercel Dashboard -> Settings -> Environment Variables and ensure OPENROUTER_API_KEY is properly set.'
    }, { status: 500 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, role, experience, education, skills, template } = body;

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": req.headers.get('origin') || 'https://ai-generated-resume-rho.vercel.app/',
        "X-Title": 'AI Resume Builder (Elevate AI)',
      }
    });

    const models = [
      "google/gemini-2.0-flash-lite-preview-02-05:free",
      "google/gemini-2.0-pro-exp-02-05:free",
      "qwen/qwen-2.5-72b-instruct:free",
      "microsoft/phi-3-medium-128k-instruct:free",
      "meta-llama/llama-3.1-8b-instruct:free",
      "meta-llama/llama-3.3-70b-instruct:free"
    ];

    let detailedErrors: string[] = [];
    let completion = null;

    for (const model of models) {
      try {
        console.log(`Trying AI Node: ${model}`);
        completion = await openai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: "You are an expert resume writer. Output ONLY raw JSON matching the requested schema." },
            { role: "user", content: `Create a professional resume JSON for ${name} (${role}). Experience: ${experience}. Education: ${education}. Template style: ${template}. Return EXACT schema: { "name": "", "role": "", "contact": [], "summary": "", "experience": [], "education": [], "skills": [] }` }
          ],
          temperature: 0.6,
          max_tokens: 2000
        });
        if (completion?.choices?.[0]?.message?.content) break;
      } catch (err: any) {
        detailedErrors.push(`${model}: ${err.message}`);
        
        // Immediate Auth Check
        if (err.message.includes('401') || err.message.toLowerCase().includes('auth') || err.message.toLowerCase().includes('invalid api key')) {
          return NextResponse.json({ 
            error: `AUTHENTICATION FAILED: The Key starting with "${keyPrefix}..." was rejected by OpenRouter.`,
            troubleshooting: '1. Copy the key sk-or-v1-525...d22 from your dashboard. 2. Update it in Vercel Settings -> Environment Variables.',
            details: detailedErrors
          }, { status: 401 });
        }
      }
    }

    if (!completion || !completion.choices?.[0]?.message?.content) {
      return NextResponse.json({ 
        error: `AI CLUSTER OFFLINE (Active Key: ${keyPrefix}...)`,
        details: detailedErrors,
        troubleshooting: "Current OpenRouter key is either out of credits or inactive. Please swap to the working key from your other project."
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
