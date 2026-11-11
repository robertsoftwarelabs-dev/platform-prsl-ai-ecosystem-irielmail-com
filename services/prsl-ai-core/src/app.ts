import { Hono } from "hono";
import { z } from "zod";
import { coreExecutionRequestSchema, type CoreExecutionResponse } from "./contracts";
import type { CorePorts, RoutePlan, ServicePrincipal } from "./ports";

const REQUIRED_SCOPE = "prsl.core.execute";

function localityAllows(
  required: "on_device" | "local" | "platform_hosted" | "any",
  actual: RoutePlan["execution_mode"]
): boolean {
  switch (required) {
    case "on_device":
      return actual === "on_device";
    case "local":
      return actual === "on_device" || actual === "local";
    case "platform_hosted":
      return actual === "on_device" || actual === "local" || actual === "platform_hosted";
    case "any":
      return true;
  }
}

function errorResponse(
  requestId: string,
  status: CoreExecutionResponse["status"],
  code: string
): CoreExecutionResponse {
  return {
    schema_version: "1.0",
    request_id: requestId,
    status,
    error: { code }
  };
}

export function createCoreApp(ports?: CorePorts) {
  const app = new Hono();

  app.get("/healthz", (c) => {
    const ready = Boolean(ports);
    return c.json(
      {
        service: "prsl-ai-core-fetch-adapter",
        contract_version: "1.0",
        status: ready ? "ready" : "degraded",
        execution_enabled: ready
      },
      ready ? 200 : 503
    );
  });

  app.post("/v1/execute", async (c) => {
    const raw = await c.req.json().catch(() => null);
    const parsed = coreExecutionRequestSchema.safeParse(raw);
    const fallbackId =
      raw && typeof raw === "object" && "request_id" in raw && typeof raw.request_id === "string"
        ? raw.request_id
        : "00000000-0000-4000-8000-000000000000";

    if (!parsed.success) {
      return c.json(errorResponse(fallbackId, "failed", "INVALID_REQUEST"), 400);
    }

    const request = parsed.data;
    if (!ports) {
      return c.json(errorResponse(request.request_id, "unavailable", "CORE_PORTS_UNAVAILABLE"), 503);
    }

    let principal: ServicePrincipal | null;
    try {
      principal = await ports.authenticate(c.req.raw);
    } catch {
      return c.json(errorResponse(request.request_id, "unavailable", "SERVICE_AUTH_UNAVAILABLE"), 503);
    }
    if (!principal) {
      return c.json(errorResponse(request.request_id, "blocked", "SERVICE_UNAUTHENTICATED"), 401);
    }
    if (!principal.scopes.includes(REQUIRED_SCOPE)) {
      return c.json(errorResponse(request.request_id, "blocked", "SERVICE_SCOPE_INSUFFICIENT"), 403);
    }

    let plan: RoutePlan | null;
    try {
      plan = await ports.route(request, principal);
    } catch {
      return c.json(errorResponse(request.request_id, "unavailable", "ROUTER_UNAVAILABLE"), 503);
    }
    if (!plan) {
      return c.json(errorResponse(request.request_id, "unavailable", "NO_ELIGIBLE_ROUTE"), 503);
    }

    if (!localityAllows(request.constraints.required_locality, plan.execution_mode)) {
      return c.json(errorResponse(request.request_id, "blocked", "EXECUTION_LOCALITY_VIOLATION"), 403);
    }
    if (plan.execution_mode === "approved_remote" && !plan.provider_id) {
      return c.json(errorResponse(request.request_id, "blocked", "REMOTE_PROVIDER_ID_REQUIRED"), 403);
    }
    if (
      request.constraints.provider_allowlist.length > 0 &&
      (!plan.provider_id || !request.constraints.provider_allowlist.includes(plan.provider_id))
    ) {
      return c.json(errorResponse(request.request_id, "blocked", "PROVIDER_CONSTRAINT_VIOLATION"), 403);
    }
    if (
      request.constraints.region_allowlist.length > 0 &&
      (!plan.region_id || !request.constraints.region_allowlist.includes(plan.region_id))
    ) {
      return c.json(errorResponse(request.request_id, "blocked", "REGION_CONSTRAINT_VIOLATION"), 403);
    }

    let authorization;
    try {
      authorization = await ports.authorize(request, plan, principal);
    } catch {
      return c.json(errorResponse(request.request_id, "unavailable", "PERMISSION_MANAGER_UNAVAILABLE"), 503);
    }
    if (authorization.status === "denied") {
      return c.json(errorResponse(request.request_id, "blocked", "PERMISSION_DENIED"), 403);
    }
    if (authorization.status === "indeterminate") {
      return c.json(errorResponse(request.request_id, "unavailable", "PERMISSION_DECISION_INDETERMINATE"), 503);
    }

    if (!z.string().uuid().safeParse(authorization.decision_id).success) {
      return c.json(errorResponse(request.request_id, "unavailable", "PERMISSION_DECISION_INVALID"), 503);
    }

    let execution;
    try {
      execution = await ports.executeAuthorized(request, plan, authorization.decision_id, principal);
    } catch {
      return c.json(errorResponse(request.request_id, "unavailable", "TRUSTED_EXECUTION_UNAVAILABLE"), 503);
    }

    if (execution.status === "unavailable") {
      return c.json(errorResponse(request.request_id, "unavailable", "RUNTIME_UNAVAILABLE"), 503);
    }
    if (execution.status === "failed") {
      return c.json(errorResponse(request.request_id, "failed", "EXECUTION_FAILED"), 502);
    }

    const response: CoreExecutionResponse = {
      schema_version: "1.0",
      request_id: request.request_id,
      status: "completed",
      execution: {
        capability_id: execution.plan.capability_id,
        capability_version: execution.plan.capability_version,
        runtime_id: execution.plan.runtime_id,
        execution_mode: plan.execution_mode,
        ...(plan.provider_id ? { provider_id: plan.provider_id } : {})
      },
      output: execution.output
    };
    return c.json(response, 200);
  });

  return app;
}
