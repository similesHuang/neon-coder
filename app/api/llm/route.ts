import { Message } from "@/types/common";
import { NextRequest } from "next/server";
import OpenAI from "openai";
export const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: process.env.BASE_URL,
});
export async function POST(request: NextRequest) {
  const { messages }: { messages: Message[] } = await request.json();
  const completion = await openai.chat.completions.create({
    model: "qwen-max",
    messages: messages?.map((msg) => {
      return {
        role: msg.role || "user",
        content: msg.content || "",
      };
    }),
    stream: true,
  });
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices?.[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
      } catch (err) {
        controller.enqueue(encoder.encode(`[ERROR] ${String(err)}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
