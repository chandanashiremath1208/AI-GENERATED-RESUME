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
        console.log(`Trying Omni-Node: ${model}`);
        completion = await openai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: "You are an expert resume writer. Output ONLY raw JSON." },
            { role: "user", content: `Create a professional resume JSON for ${name} (${role}). Experience: ${experience}. Education: ${education}. Template: ${template}. Return EXACT matching schema.` }
          ],
          temperature: 0.6,
          max_tokens: 2000
        });
        if (completion?.choices?.[0]?.message?.content) break;
      } catch (err: any) {
        console.error(`Omni-Node ${model} failed:`, err.message);
        detailedErrors.push(`${model}: ${err.message}`);
        
        // Critical: If it's a 401, stop immediately as the KEY is the issue
        if (err.message.includes('401') || err.message.toLowerCase().includes('auth')) {
          return NextResponse.json({ 
            error: "CRITICAL: OpenRouter Authentication Failed. Please check your API Key in environment variables.",
            details: detailedErrors
          }, { status: 401 });
        }

        // Critical: If it's a 402, stop immediately as the QUOTA is empty
        if (err.message.includes('402') || err.message.toLowerCase().includes('payment') || err.message.toLowerCase().includes('credit')) {
          return NextResponse.json({ 
            error: "QUOTA EXHAUSTED: Your OpenRouter account has 0 credits or has reached its free limit.",
            details: detailedErrors,
            troubleshooting: "1. Top up your OpenRouter credits. 2. Use a different API Key. 3. Check if your other project 'utube-summarizer' has a working key."
          }, { status: 402 });
        }
      }
    }

    if (!completion || !completion.choices?.[0]?.message?.content) {
      return NextResponse.json({ 
        error: "AI ECOSYSTEM OFFLINE: Failed across all 6 high-availability nodes.",
        details: detailedErrors,
        troubleshooting: "1. Check your OpenRouter credits. 2. Verify OPENROUTER_API_KEY in Vercel settings. 3. Try again in 60 seconds."
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
