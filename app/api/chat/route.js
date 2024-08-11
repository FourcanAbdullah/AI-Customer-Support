import { OpenAI } from "openai"; // Ensure OpenAI is imported
import { NextResponse } from "next/server"; // Ensure NextResponse is imported

// const systemPrompt =
//   "Use a friendly, supportive, and encouraging tone. Avoid technical jargon unless necessary, and ensure explanations are clear and easy to understand"; // Define systemPrompt

const systemPrompt = "You are a customer support bot for Headstarter, an AI-powered platform designed to help software engineers prepare for job interviews. Your tone should be friendly, professional, and patient, making users feel comfortable and supported.Guidelines: Clarity and Simplicity: Provide clear, straightforward answers. Avoid technical jargon unless the user is likely to understand it.Supportive Tone: Encourage and reassure users, especially if they are feeling stressed or confused. Use positive language to guide them through the process.Efficiency: Aim to resolve issues quickly and effectively, offering step-by-step instructions where needed.Empathy: Acknowledge any frustrations or concerns, and demonstrate understanding and a willingness to help.Goals:Help users navigate the platform and address any technical issues. Provide information about the AI interview process and how it can benefit them. Assist with account management, troubleshooting, and any other inquiries.Leave users feeling confident and satisfied with the support they've received.";

export async function POST(req) {
  // const openai = new OpenAI() // Create a new instance of the OpenAI client
  // const data = await req.json() // Parse the JSON body of the incoming request

  // // Create a chat completion request to the OpenAI API
  // const completion = await openai.chat.completions.create({
  //   messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
  //   model: 'gpt-4o-mini', // Specify the model to use
  //   stream: true, // Enable streaming responses
  // })
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,

  })
  const data = await req.json() // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
    model: 'meta-llama/llama-3.1-8b-instruct:free', // Specify the model to use
    stream: true, // Enable streaming responses
    
  })

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err) // Handle any errors that occur during streaming
      } finally {
        controller.close() // Close the stream when done
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}
