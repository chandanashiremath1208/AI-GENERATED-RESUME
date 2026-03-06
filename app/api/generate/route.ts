import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://ai-resume-builder.vercel.app/',
      "X-Title": 'AI Resume Builder',
    }
  });

  try {
    const body = await req.json();
    const { name, email, phone, role, summary, experience, education, skills } = body;

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'OpenRouter API key not configured.' }, { status: 500 });
    }

    const prompt = `
      You are an expert professional resume writer.
      You must take the following inputs and create a highly professional, ATS-friendly resume.
      
      User Inputs:
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Target Role: ${role}
      Professional Summary: ${summary}
      Experience: ${experience}
      Education: ${education}
      Skills: ${skills}
      
      CRITICAL: You must answer ONLY with a valid, raw JSON object representing the generated resume. Do NOT wrap the JSON in markdown code blocks (like \`\`\`json). Do not add any conversational text.
      Expand brief points into professional, impactful sentences. Do NOT invent fake jobs or degrees, but DO enhance the bullet points professionally.
      
      The JSON object must EXACTLY follow this structure:
      {
        "name": "Full Name",
        "role": "Target Role (uppercase)",
        "contact": [
          { "type": "email", "value": "email address" },
          { "type": "phone", "value": "phone number" }
        ],
        "summary": "A fully fleshed out, professional summary paragraph synthesizing their background and goals.",
        "experience": [
          {
            "company": "Company Name",
            "role": "Job Title",
            "date": "Month Year - Month Year",
            "location": "City, State (if known, else omit)",
            "bullets": [
              "Impactful action-oriented bullet point 1",
              "Impactful action-oriented bullet point 2"
            ]
          }
        ],
        "education": [
          {
            "institution": "School / University Name",
            "degree": "Degree and Major",
            "date": "Graduation Year",
            "details": ["Any notable achievements or just empty array if none"]
          }
        ],
        "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Fill this with up to 12 relevant skills sorted logically"]
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: [
        { role: "system", content: "You are an expert resume parser and writer. You output strictly raw JSON matching the requested schema." },
        { role: "user", content: prompt }
      ],
      temperature: 0.6,
    });

    let resumeContent = completion.choices[0]?.message?.content || "";
    
    // Clean up markdown wrapping if the AI accidentally includes it
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
