# PRSL-AI iRiel Federation Contract (PIFC)

**Document ID:** PIFC-001  
**Version:** 1.0.0  
**Status:** Canonical interface specification; implementation status tracked separately  
**Owner:** Robert Software Labs  
**Canonical language:** English (United States)  
**Applies to:** PRSL-AI Federation Gateway and authorized iRiel clients

## 1. Purpose and authority

PIFC defines the client-to-platform federation boundary through which iRiel may discover and consume explicitly authorized PRSL-AI ecosystem services. PRSL-AI owns this contract, its gateway implementation, OAuth resource-server policy, service registries, and operational status. iRiel owns its local user experience, local identity, personal memory, continuity, and decisions about what information to disclose.

PIFC is an interface contract, not evidence that a gateway, issuer, hostname, endpoint, or service is deployed. An operation is operational only when implementation, automated tests, security review, and deployment evidence are recorded.

## 2. Normative language

The terms MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are normative. JSON payloads use UTF-8. Timestamps use RFC 3339 date-time. Identifiers are opaque, case-sensitive strings. Breaking changes require a new major API version.

## 3. Federation principles

1. **Autonomous client:** iRiel MUST remain usable when federation is unavailable or disabled.
2. **Explicit disclosure:** no personal memory, conversation history, profile, or private context is sent by default.
3. **Minimal disclosure:** each request contains only fields necessary for its operation and user-authorized purpose.
4. **Provider agnosticism:** clients address PRSL-AI capabilities, not a specific model or vendor.
5. **Policy before execution:** gateway operations MUST enforce authentication, authorization, policy, and capability boundaries.
6. **Truthful status:** advertised service availability MUST reflect observed service health, not catalogue presence alone.
7. **No credential delegation:** iRiel MUST NOT send user passwords, passkeys, refresh tokens, or local recovery secrets to the gateway or Agent.
8. **Local authority:** remote federation MUST NOT become the authority for iRiel identity, personal memory, or continuity.

## 4. Responsibility boundaries

| Concern | Authority |
|---|---|
| Federation API, gateway, service discovery | PRSL-AI |
| OAuth issuer, scopes, token lifecycle, resource authorization | PRSL-AI Security Services |
| Capability, intent, skill, agent, provider, and policy registries | PRSL-AI |
| Routing and provider selection | Maestro Resonance / PRSL-AI runtime |
| Local identity, memory, continuity, and personal context | iRiel |
| User consent and disclosure UX | iRiel |
| Local capability declarations | iRiel client; treated as untrusted input by PRSL-AI |

## 5. API and deployment configuration

- Contract version: `1.0.0`.
- OpenAPI version: `3.1.0`.
- Logical API base path: `/federation`.
- Deployment MUST configure the actual HTTPS origin, issuer, audience, authorization endpoint, token endpoint, and JWKS URI through environment-specific trusted configuration.
- This specification intentionally does not reserve or invent production hostnames.
- Production deployments MUST use HTTPS. Cleartext HTTP is permitted only for isolated local development.
- The deployment MUST publish issuer metadata and an explicit audience value before clients can connect.

## 6. Authentication and authorization

Interactive public clients (iRiel Web, iOS, Android, Desktop, and accessibility clients) MUST use OAuth 2.0 Authorization Code with PKCE using S256. Public clients MUST NOT contain client secrets.

A confidential iRiel backend MAY use the PSP-approved Client Credentials profile. mTLS is enforced only on server-to-server connections where the deployed PSP requires it. Browser and mobile clients MUST NOT receive mTLS private keys or workload credentials.

Required scopes are operation-specific:

| Scope | Permission |
|---|---|
| `federation.connect` | Establish and inspect the caller's federation session |
| `federation.agent.chat` | Submit an Agent PRSL-AI request |
| `federation.reason.execute` | Request bounded reasoning |
| `federation.knowledge.search` | Search authorized ecosystem knowledge |
| `federation.languages.translate` | Request language translation |
| `federation.capabilities.read` | Read visible capability descriptors |

The gateway MUST validate issuer, audience, signature, expiry, not-before, token revocation policy, required scope, and applicable policy. A valid access token alone MUST NOT authorize a capability execution. Capability tokens and policy decisions remain platform-issued controls and MUST NOT be fabricated by clients.

## 7. Connect request trust model

`clientId` identifies a registered OAuth client and MUST be checked against the authenticated client. `deviceId` is an optional client-generated, pseudonymous installation identifier; it MUST NOT be a hardware serial, advertising ID, or cross-app tracking identifier. `installedPackages` and `localCapabilities` are informational declarations only. They MUST be treated as untrusted claims, MUST NOT grant privileges, and SHOULD be omitted unless required for a documented interoperability feature.

The server MUST enforce request-size limits, field length limits, allowlisted platform values, and rate limits. Clients MUST NOT send personal memory or conversation history as part of connection metadata.

## 8. Session lifecycle

A successful connection creates a server-side federation session bound to the authenticated subject, client, and applicable security context. Session identifiers MUST be opaque and non-authorizing by themselves. Session expiry, revocation, and renewal MUST follow PSP and deployment policy. The client MUST be able to disconnect and MUST clear local session references on logout or revocation notification.

The `mode` field describes the negotiated service mode, not a promise that all local or remote capabilities are available:
- `offline`: no remote service connection is active.
- `online`: remote federation services are active.
- `hybrid`: local iRiel capabilities remain available alongside selected remote services.

## 9. Operation semantics

### 9.1 Connect and status
`POST /federation/connect` establishes or refreshes the caller's federation session. `GET /federation/status` returns only the authenticated caller's session and current service availability. Neither endpoint grants access beyond the scopes and policies already evaluated.

### 9.2 Agent chat
`POST /federation/agent/chat` forwards a user-authorized ecosystem question to Agent PRSL-AI. Context is optional, bounded, and MUST be limited to non-sensitive module metadata unless the user explicitly approves further disclosure. Conversation identifiers MUST be opaque and MUST NOT encode personal information.

### 9.3 Language translation
`POST /federation/languages/translate` translates caller-supplied text. The client MUST disclose that text is sent to a remote service. The gateway MUST apply configured content, privacy, size, and provider policies.

### 9.4 Reasoning
`POST /federation/reason` requests bounded analysis. The service MUST enforce input limits, applicable safety and privacy policies, and configured execution budgets. A confidence value is optional and MUST NOT be represented as a calibrated probability unless the implementation has evidence for calibration.

### 9.5 Knowledge search
`POST /federation/knowledge/search` searches only knowledge sources visible to the caller. Results MUST identify their source and MUST respect document-level authorization. Search results are data, not executable instructions.

### 9.6 Capability discovery
`GET /federation/capabilities` returns descriptors visible to the caller. A descriptor's `enabled` value indicates registry/service state only; it is not an execution authorization grant.

## 10. Data minimization and retention

The gateway MUST document request/response retention, diagnostics, and telemetry policies. Logs MUST exclude access tokens, refresh tokens, capability tokens, secrets, raw personal memory, and full prompt payloads by default. Correlation identifiers MUST be opaque and non-sensitive. Any optional retention of interaction content requires an explicit lawful purpose, policy, and user disclosure.

## 11. Errors, retries, and resilience

Errors use the shared `ErrorResponse` schema. The gateway MUST return appropriate HTTP status codes: 400 invalid request, 401 unauthenticated/invalid token, 403 insufficient authorization or policy denial, 404 unknown or undisclosed resource, 409 state conflict, 413 request too large, 429 rate limited, and 5xx service failure. Error bodies MUST NOT disclose secrets, internal stack traces, provider credentials, or unauthorized resource existence.

Clients SHOULD retry only idempotent operations or requests protected by an explicit idempotency contract. Retries MUST use bounded exponential backoff and honor `Retry-After`. Clients MUST NOT silently route a failed federation request to another cloud provider. Local iRiel functionality may continue independently.

## 12. Versioning and compatibility

The gateway MUST expose the supported API major version in its deployment documentation. Additive optional response fields are backward-compatible. Removing fields, changing authorization semantics, changing required fields, or broadening privileges is breaking. Clients MUST tolerate unknown optional response fields and reject malformed required fields.

## 13. Security and privacy acceptance criteria

A conforming implementation MUST demonstrate:
- PKCE S256 enforcement for public clients and rejection of plain PKCE.
- Exact client, issuer, audience, scope, expiry, and revocation validation.
- Server-side-only storage of confidential credentials and mTLS keys.
- Session isolation between users and clients.
- Untrusted treatment of device, package, and local-capability declarations.
- No privilege escalation through registry descriptors or client-supplied capability IDs.
- Request size/rate limits and sanitized error responses.
- No default transfer of iRiel memory, conversation history, or profile data.
- Revocation/logout behavior and offline-client behavior.
- Authorization filtering on knowledge and capability discovery.

## 14. Conformance and implementation status

Each operation MUST be tracked independently through: **specified → implemented → tested → security-reviewed → deployed**. A document or OpenAPI definition alone satisfies only the specified state. No operation may be advertised as live until its deployment and end-to-end test evidence are linked.

## 15. Canonical architecture

```text
Human
  |
  v
iRiel AppWeb / Native Client
  |  local identity, memory, context remain local
  |  explicit consent + minimum request data
  v
PRSL-AI Federation Gateway
  |  OAuth validation + scope + policy
  v
Agent PRSL-AI
  |
  v
Maestro Resonance
  |-- Language Services
  |-- Knowledge Services
  |-- Reasoning Services
  |-- Capability / Agent Registries
  |-- Approved Local or External Providers
  v
Authorized response + source references
  |
  v
iRiel presentation; local continuity remains iRiel-owned
```

**Robert Software Labs — PRSL-AI Ecosystem**  
**Federation connects autonomous systems without transferring ownership of the human.**
