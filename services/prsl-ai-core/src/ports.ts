import type { CoreExecutionRequest, executionModeSchema } from "./contracts";
import type { z } from "zod";

export interface ServicePrincipal {
  service_id: string;
  audit_subject_ref: string;
  scopes: string[];
}

export interface RoutePlan {
  capability_id: string;
  capability_version: string;
  runtime_id: string;
  execution_mode: z.infer<typeof executionModeSchema>;
  provider_id?: string;
  region_id?: string;
}

export type AuthorizationDecision =
  | { status: "granted"; decision_id: string }
  | { status: "denied"; reason_code: string }
  | { status: "indeterminate"; reason_code: string };

export type AuthorizedExecutionResult =
  | {
      status: "completed";
      output: unknown;
    }
  | { status: "unavailable"; reason_code: string }
  | { status: "failed"; reason_code: string };

export interface CorePorts {
  /** Must authenticate the calling service from trusted server-side credentials. */
  authenticate(request: Request, signal: AbortSignal): Promise<ServicePrincipal | null>;
  /** Must resolve projection_ref server-side and call platform policy/Router; never trust client-supplied candidates or classification as authority. */
  route(request: CoreExecutionRequest, principal: ServicePrincipal, signal: AbortSignal): Promise<RoutePlan | null>;
  /** Must re-resolve the context projection and call the platform Permission Manager; client purpose/classification are hints, never proof of consent. */
  authorize(
    request: CoreExecutionRequest,
    plan: RoutePlan,
    principal: ServicePrincipal,
    signal: AbortSignal
  ): Promise<AuthorizationDecision>;
  /**
   * Must atomically verify and consume the one-time Permission Manager decision
   * at the trusted execution boundary, enforce the request deadline, validate output
   * against the registered capability schema, and only then return the result.
   */
  executeAuthorized(
    request: CoreExecutionRequest,
    plan: RoutePlan,
    decisionId: string,
    principal: ServicePrincipal,
    signal: AbortSignal
  ): Promise<AuthorizedExecutionResult>;
}
