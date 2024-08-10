import { OpenAI } from "openai"; // Ensure OpenAI is imported
import { NextResponse } from "next/server"; // Ensure NextResponse is imported

const systemPrompt =
  "Use a friendly, supportive, and encouraging tone. Avoid technical jargon unless necessary, and ensure explanations are clear and easy to understand"; // Define systemPrompt

export async function POST(req) {
  const openai = new OpenAI();
  const data = await req.json();

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: systemPrompt }, ...data],
    model: "gpt-3.5-turbo",
  });

  return NextResponse.json(
    { message: completion.choices[0].message.content },
    { status: 200 }
  );
}
