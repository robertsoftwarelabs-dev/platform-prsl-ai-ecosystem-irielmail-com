import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const askAgent = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ question: z.string().trim().min(1).max(1000), consent: z.literal(true) }).parse(d))
  .handler(async ({ data }) => {
    const { generateAnswer, AGENT_INSTRUCTIONS, GatewayError } = await import("./gateway.server");
    try {
      return { ok: true as const, text: await generateAnswer(data.question, AGENT_INSTRUCTIONS) };
    } catch (e) {
      return {
        ok: false as const,
        error: e instanceof GatewayError ? e.message : "The AI could not answer right now.",
      };
    }
  });
