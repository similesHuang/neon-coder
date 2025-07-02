import { Message } from "@/types/common";
import { NextRequest } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.DEEP_SEEK_API_KEY,
    baseURL: process.env.DEEP_SEEK_BASE_URL,
  });

  const { messages }: { messages: Message[] } = await request.json();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        const completion = await openai.chat.completions.create({
          model: "deepseek-v3",
          messages,
          stream: true,
        });

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
