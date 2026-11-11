import { describe, expect, it, vi } from "vitest";
import { createCoreApp } from "./app";
import type { CorePorts, RoutePlan } from "./ports";

const validRequest = {
  schema_version: "1.0",
  request_id: "00000000-0000-4000-8000-000000000001",
  intent: {
    intent_id: "intent-1",
    intent_type: "summarize",
    locale: "en-US"
  },
  context: {
    projection_ref: "context-projection:abc123",
    purpose_id: "user-request",
    data_classification: "personal"
  },
  constraints: {
    required_locality: "local",
    remote_fallback: "forbidden",
    provider_allowlist: [],
    region_allowlist: [],
    deadline_ms: 30000
  }
};

const principal = {
  service_id: "iriel-appweb",
  audit_subject_ref: "service:iriel-appweb",
  scopes: ["prsl.core.execute"]
};

const localPlan: RoutePlan = {
  capability_id: "prsl.capability.summarize",
  capability_version: "1.0.0",
  runtime_id: "rsl-local-runtime",
  execution_mode: "local"
};

function makePorts(overrides: Partial<CorePorts> = {}): CorePorts {
  return {
    authenticate: vi.fn(async () => principal),
    route: vi.fn(async () => localPlan),
    authorize: vi.fn(async () => ({ status: "granted" as const, decision_id: "00000000-0000-4000-8000-000000000002" })),
    executeAuthorized: vi.fn(async () => ({
      status: "completed" as const,
      output: { text: "result" }
    })),
    ...overrides
  };
}

describe("PRSL-AI Core Fetch adapter", () => {
  it("reports degraded health until platform ports are configured", async () => {
    const response = await createCoreApp().request("/healthz");
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ status: "degraded", execution_enabled: false });
  });

  it("fails closed when platform ports are unavailable", async () => {
    const response = await createCoreApp().request("/v1/execute", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validRequest)
    });
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ error: { code: "CORE_PORTS_UNAVAILABLE" } });
  });

  it("rejects malformed requests before routing", async () => {
    const ports = makePorts();
    const response = await createCoreApp(ports).request("/v1/execute", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer service-token" },
      body: JSON.stringify({ ...validRequest, context: { projection_ref: "" } })
    });
    expect(response.status).toBe(400);
    expect(ports.route).not.toHaveBeenCalled();
  });

  it("rejects unauthenticated callers", async () => {
    const ports = makePorts({ authenticate: vi.fn(async () => null) });
    const response = await createCoreApp(ports).request("/v1/execute", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validRequest)
    });
    expect(response.status).toBe(401);
    expect(ports.route).not.toHaveBeenCalled();
  });

  it("requires the platform execution scope", async () => {
    const ports = makePorts({
      authenticate: vi.fn(async () => ({ ...principal, scopes: [] }))
    });
    const response = await createCoreApp(ports).request("/v1/execute", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validRequest)
    });
    expect(response.status).toBe(403);
    expect(ports.route).not.toHaveBeenCalled();
  });

  it("rejects remote routing for a local-only request before authorization", async () => {
    const remotePlan: RoutePlan = { ...localPlan, execution_mode: "approved_remote", provider_id: "external-provider" };
    const ports = makePorts({ route: vi.fn(async () => remotePlan) });
    const response = await createCoreApp(ports).request("/v1/execute", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validRequest)
    });
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ error: { code: "EXECUTION_LOCALITY_VIOLATION" } });
    expect(ports.authorize).not.toHaveBeenCalled();
    expect(ports.executeAuthorized).not.toHaveBeenCalled();
  });

  it("enforces provider allowlists without treating them as authorization", async () => {
    const request = {
      ...validRequest,
      constraints: { ...validRequest.constraints, required_locality: "any", provider_allowlist: ["approved-provider"] }
    };
    const remotePlan: RoutePlan = {
      ...localPlan,
      execution_mode: "approved_remote",
      provider_id: "unapproved-provider"
    };
    const ports = makePorts({ route: vi.fn(async () => remotePlan) });
    const response = await createCoreApp(ports).request("/v1/execute", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(request)
    });
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ error: { code: "PROVIDER_CONSTRAINT_VIOLATION" } });
    expect(ports.authorize).not.toHaveBeenCalled();
    expect(ports.executeAuthorized).not.toHaveBeenCalled();
  });

  it("does not execute remote routes without Permission Manager approval", async () => {
    const request = {
      ...validRequest,
      constraints: { ...validRequest.constraints, required_locality: "any" }
    };
    const remotePlan: RoutePlan = {
      ...localPlan,
      execution_mode: "approved_remote",
      provider_id: "approved-provider"
    };
    const ports = makePorts({
      route: vi.fn(async () => remotePlan),
      authorize: vi.fn(async () => ({ status: "denied" as const, reason_code: "REMOTE_DISCLOSURE_NOT_AUTHORIZED" }))
    });
    const response = await createCoreApp(ports).request("/v1/execute", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(request)
    });
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ error: { code: "PERMISSION_DENIED" } });
    expect(ports.executeAuthorized).not.toHaveBeenCalled();
  });

  it("rejects an invalid Permission Manager decision reference", async () => {
    const ports = makePorts({
      authorize: vi.fn(async () => ({ status: "granted" as const, decision_id: "not-a-uuid" }))
    });
    const response = await createCoreApp(ports).request("/v1/execute", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validRequest)
    });
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ error: { code: "PERMISSION_DECISION_INVALID" } });
    expect(ports.executeAuthorized).not.toHaveBeenCalled();
  });

  it("does not execute when the Permission Manager denies", async () => {
    const ports = makePorts({
      authorize: vi.fn(async () => ({ status: "denied" as const, reason_code: "CONSENT_REQUIRED" }))
    });
    const response = await createCoreApp(ports).request("/v1/execute", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validRequest)
    });
    expect(response.status).toBe(403);
    expect(ports.executeAuthorized).not.toHaveBeenCalled();
  });

  it("fails closed when Permission Manager cannot decide", async () => {
    const ports = makePorts({
      authorize: vi.fn(async () => ({ status: "indeterminate" as const, reason_code: "PM_UNAVAILABLE" }))
    });
    const response = await createCoreApp(ports).request("/v1/execute", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validRequest)
    });
    expect(response.status).toBe(503);
    expect(ports.executeAuthorized).not.toHaveBeenCalled();
  });

  it("routes, authorizes, and executes through injected trusted ports", async () => {
    const ports = makePorts();
    const response = await createCoreApp(ports).request("/v1/execute", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validRequest)
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      status: "completed",
      execution: { capability_id: "prsl.capability.summarize", execution_mode: "local" },
      output: { text: "result" }
    });
    expect(ports.route).toHaveBeenCalledTimes(1);
    expect(ports.authorize).toHaveBeenCalledTimes(1);
    expect(ports.executeAuthorized).toHaveBeenCalledTimes(1);
  });

  it("fails closed when the router adapter is unavailable", async () => {
    const ports = makePorts({ route: vi.fn(async () => { throw new Error("unavailable"); }) });
    const response = await createCoreApp(ports).request("/v1/execute", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validRequest)
    });
    expect(response.status).toBe(503);
    expect(ports.authorize).not.toHaveBeenCalled();
  });
});
