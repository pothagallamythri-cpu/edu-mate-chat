import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SYSTEM = `You are "Classroom AI", a friendly learning assistant for school students (Class 6-10) and beginners.
You can: explain topics clearly, simplify difficult concepts, give real-life examples, create quizzes (multiple choice with answers at the end), and list important exam questions.
If the student asks for Telugu, reply fully in Telugu script (తెలుగు) using simple words. Otherwise reply in simple English.
Use short paragraphs, bullet points and **bold** key terms. Keep answers focused and encouraging. Use an emoji or two where helpful.`;

const schema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(8000) }))
    .min(1)
    .max(40),
});

export const askClassroomAI = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => schema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { reply: null, error: "AI is not configured yet." };
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM }, ...data.messages],
      }),
    });
    if (res.status === 429) return { reply: null, error: "Too many questions right now — please wait a moment." };
    if (res.status === 402) return { reply: null, error: "AI credits are used up. Please ask your admin to add credits." };
    if (!res.ok) {
      console.error("AI gateway error", res.status, await res.text());
      return { reply: null, error: "The AI couldn't answer. Please try again." };
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return { reply: json.choices?.[0]?.message?.content ?? "", error: null };
  });
