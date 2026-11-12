import { z } from "zod";

export const executionModeSchema = z.enum([
  "on_device",
  "local",
  "platform_hosted",
  "approved_remote"
]);

export const coreExecutionRequestSchema = z.object({
  schema_version: z.literal("1.0"),
  request_id: z.string().uuid(),
  intent: z.object({
    intent_id: z.string().min(1).max(128),
    intent_type: z.string().min(1).max(128),
    locale: z.string().min(2).max(35).optional(),
    confidence: z.number().min(0).max(1).optional()
  }).strict(),
  context: z.object({
    projection_ref: z.string().min(1).max(256),
    purpose_id: z.string().min(1).max(128),
    data_classification: z.enum(["public", "personal", "sensitive", "restricted"])
  }).strict(),
  constraints: z.object({
    required_locality: z.enum(["on_device", "local", "platform_hosted", "any"]).default("local"),
    remote_fallback: z.literal("forbidden").default("forbidden"),
    provider_allowlist: z.array(z.string().min(1).max(128)).max(64).default([]),
    region_allowlist: z.array(z.string().min(1).max(64)).max(32).default([]),
    deadline_ms: z.number().int().min(100).max(120_000).default(30_000)
  }).strict().default({
    required_locality: "local",
    remote_fallback: "forbidden",
    provider_allowlist: [],
    region_allowlist: [],
    deadline_ms: 30_000
  })
}).strict();

export type CoreExecutionRequest = z.output<typeof coreExecutionRequestSchema>;

export interface CoreExecutionResponse {
  schema_version: "1.0";
  request_id: string;
  status: "completed" | "blocked" | "unavailable" | "failed";
  execution?: {
    capability_id: string;
    capability_version: string;
    runtime_id: string;
    execution_mode: z.infer<typeof executionModeSchema>;
    provider_id?: string;
  };
  output?: unknown;
  error?: {
    code: string;
  };
}
