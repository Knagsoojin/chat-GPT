import {OpenAIStream, StreamingTextResponse} from "ai";
import {NextRequest} from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  return new Response("Hello world!");
}

export async function POST(req: NextRequest) {
  const {messages} = await req.json(); //body에 온 애들을 json으로 바꾼 것
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    temperature: 0.7,
    messages,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
