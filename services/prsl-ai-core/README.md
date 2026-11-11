# PRSL-AI Core — Hono Fetch Adapter

**Owner:** PRSL-AI Ecosystem  
**Status:** Platform-owned transport adapter foundation; production ports and deployment are not configured.  
**Decision:** [PRSL-AI Core Transport Decision](../../docs/architecture/PRSL-AI-CORE-TRANSPORT-DECISION.md)

This package is the platform-owned Hono Fetch transport adapter. It is not the PRSL-AI Core architecture itself. Core remains modular and is composed from the platform's versioned contracts, policy, Permission Manager, Capability Registry, Intelligence Router, trusted execution boundary, and approved runtime adapters.

## Security boundary

- Service authentication is injected through a trusted server-side `authenticate` port.
- Caller authentication is not user consent and is not Permission Manager authorization.
- Routing is injected through the platform Intelligence Router port; this package contains no private model/provider router.
- Protected-operation authorization is injected through the platform Permission Manager port.
- Execution is injected through a trusted port that must atomically verify and consume the one-time Permission Manager decision before invoking a runtime.
- Locality constraints are enforced by the adapter. A local-only request cannot be routed to a remote execution mode.
- Remote fallback is always forbidden in the request contract.
- The adapter does not store prompts, context, memory, credentials, or conversation history and does not log request bodies.

## Runtime status

Without all platform ports, `/healthz` reports degraded and `/v1/execute` fails closed. No production registry, policy, Permission Manager, Router, runtime, authentication adapter, or deployment is configured by this package.

Do not connect AppWeb or expose a public inference endpoint until the production adapters, trusted execution boundary, cross-repository contracts, and security tests are implemented and verified.

## Commands

```bash
npm install
npm run build
npm test
npm audit --omit=dev --audit-level=high
```
