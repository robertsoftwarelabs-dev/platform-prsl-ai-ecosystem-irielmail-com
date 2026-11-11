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
}

export type AuthorizationDecision =
  | { status: "granted"; decision_id: string }
  | { status: "denied"; reason_code: string }
  | { status: "indeterminate"; reason_code: string };

export type AuthorizedExecutionResult =
  | {
      status: "completed";
      output: unknown;
      plan: RoutePlan;
    }
  | { status: "unavailable"; reason_code: string }
  | { status: "failed"; reason_code: string };

export interface CorePorts {
  /** Must authenticate the calling service from trusted server-side credentials. */
  authenticate(request: Request): Promise<ServicePrincipal | null>;
  /** Must call the platform policy and Intelligence Router; never trust a client-supplied candidate. */
  route(request: CoreExecutionRequest, principal: ServicePrincipal): Promise<RoutePlan | null>;
  /** Must call the platform Permission Manager; it is the only authority for protected operations. */
  authorize(
    request: CoreExecutionRequest,
    plan: RoutePlan,
    principal: ServicePrincipal
  ): Promise<AuthorizationDecision>;
  /**
   * Must atomically verify and consume the one-time Permission Manager decision
   * at the trusted execution boundary before invoking the selected runtime.
   */
  executeAuthorized(
    request: CoreExecutionRequest,
    plan: RoutePlan,
    decisionId: string,
    principal: ServicePrincipal
  ): Promise<AuthorizedExecutionResult>;
}
