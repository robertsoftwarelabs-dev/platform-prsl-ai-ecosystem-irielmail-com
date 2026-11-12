# PRSL-AI Agent Technical Contracts (PAS-TC)

**Document ID:** PAS-TC-001  
**Version:** 1.0.0  
**Status:** Proposed technical contract; implementation status is tracked independently  
**Owner:** Robert Software Labs  
**Canonical language:** English (United States)  
**Applies to:** Agent PRSL-AI within the PRSL-AI Ecosystem

## 1. Purpose

PAS-TC defines the versioned HTTP contract for the PRSL-AI Agent. The Agent is the ecosystem-facing specialist for platform support, documentation, discovery, architecture guidance, feedback intake, diagnostics, linguistic services, and bounded knowledge/reasoning requests.

The Agent is distinct from iRiel Personal Intelligence Environment (PIE). iRiel coordinates a person's personal intelligence experience; Agent PRSL-AI explains and assists with the PRSL-AI platform. The Agent does not own personal memory, identity, or continuity.

This specification defines interfaces. It does not assert that every endpoint, provider, registry, diagnostic source, or hosted runtime is deployed. Each operation MUST be marked as specified, implemented, tested, and deployed only when evidence exists.

## 2. Normative language and compatibility

The terms MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are normative.

- API base path: `/agent`.
- API version: `v1` (the deployment may expose this as a base-path prefix, e.g. `/v1/agent`; one form MUST be selected in the deployment contract and used consistently).
- Media type: `application/json`.
- Identifiers are stable, case-sensitive strings.
- Timestamps use RFC 3339 UTC date-time values.
- Breaking changes require a new major API version. Additive optional fields are backward-compatible.
- Unknown request fields SHOULD be rejected for security-sensitive operations and MAY be ignored for read-only search operations, provided behavior is documented.
- All responses MUST include a correlation identifier, either in the response envelope or `X-Correlation-Id` header.

## 3. Identity and API ownership

| Concern | Canonical identifier |
|---|---|
| Agent ID | `prsl-ai.agent` |
| Display name | `PRSL-AI Agent` |
| Publisher | `Robert Software Labs` |
| Agent type | `ecosystem` |
| API service identifier | `PRSLAI.Assists.Ecosystem` |
| API naming convention | `PRSLAI.<Verb>.<Domain>` |

`iRiel.Orchestrates.Intelligence` remains an iRiel-facing API identity. It MUST NOT be reused as the PRSL-AI Agent API identity.

## 4. Security model

### 4.1 Authentication and authorization

Authentication MUST use the PRSL-AI Security Profile (PSP) and the platform's configured OAuth 2.0 authorization server. The issuer, audience, token endpoint, key set, and deployment URLs are environment configuration; this specification intentionally does not invent production hostnames.

- Interactive public clients MUST use Authorization Code with PKCE (S256). Browser and mobile clients MUST NOT contain client secrets.
- Confidential service-to-service clients MUST use Client Credentials. mTLS MUST be enforced at the transport boundary where the deployment's PSP profile requires it.
- mTLS certificates and private keys MUST remain server-side. They MUST NOT be shipped to browser/mobile clients.
- Access tokens MUST be audience-restricted and short-lived according to PSP.
- Every operation MUST enforce its declared scope and platform policy. Authentication alone is not authorization.
- Registry reads MUST still enforce tenant, visibility, and role constraints where applicable.
- Feedback submission MUST apply abuse controls and data minimization.
- Runtime/provider diagnostics MUST disclose only operational metadata authorized for the caller; credentials, raw secrets, and personal payloads MUST never be returned.

### 4.2 OAuth scopes

| Scope | Purpose |
|---|---|
| `prsl.agent.chat` | Submit a support conversation request |
| `prsl.agent.search` | Discover ecosystem knowledge and registered resources |
| `prsl.agent.feedback` | Submit feedback |
| `prsl.agent.runtime.read` | Read authorized runtime health |
| `prsl.agent.docs.read` | Search and retrieve documentation metadata |
| `prsl.agent.registry.read` | Read authorized registry entries |
| `prsl.agent.architecture.read` | Request architecture explanations |
| `prsl.agent.languages.translate` | Detect language and translate text |
| `prsl.agent.reasoning.execute` | Request bounded analysis and recommendations |

A deployment MAY split scopes further. It MUST NOT silently broaden a scope's authority.

### 4.3 Authorization separation

Authentication, authorization, capability delegation, policy decision, and execution are separate controls. The Agent MUST NOT mint its own platform authorization decisions or capability tokens. Protected actions MUST pass through the platform Permission Manager and trusted execution boundary.

## 5. Common request and response conventions

### 5.1 Correlation

Clients SHOULD send `X-Correlation-Id` using a non-sensitive opaque identifier. The service MUST return the accepted identifier or generate one. Correlation IDs MUST NOT contain credentials or personal data.

### 5.2 Error envelope

Errors use the common PRSL-AI ErrorResponse contract:

```json
{
  "code": "AUTH_403",
  "message": "The caller lacks the required scope.",
  "correlationId": "req-opaque-001",
  "timestamp": "2026-11-12T16:00:00Z",
  "details": {
    "requiredScope": "prsl.agent.docs.read"
  }
}
```

The `details` object MUST contain only safe, non-secret diagnostic data. Error messages MUST NOT disclose whether a protected resource exists when doing so would reveal unauthorized information.

### 5.3 Pagination and limits

Collection endpoints SHOULD support `limit` and opaque `cursor` query parameters. The server MUST enforce a configured maximum page size. Search requests MUST enforce bounded query length and bounded result count.

## 6. Endpoint catalogue

| Method | Path | Required scope | Purpose |
|---|---|---|---|
| POST | `/agent/chat` | `prsl.agent.chat` | Platform support conversation |
| POST | `/agent/discover` | `prsl.agent.search` | Semantic ecosystem discovery |
| POST | `/agent/feedback` | `prsl.agent.feedback` | Feedback intake |
| POST | `/agent/docs/search` | `prsl.agent.docs.read` | Documentation search |
| POST | `/agent/architecture/explain` | `prsl.agent.architecture.read` | Architecture explanation |
| GET | `/agent/capabilities` | `prsl.agent.registry.read` | List visible capabilities |
| GET | `/agent/capabilities/{capabilityId}` | `prsl.agent.registry.read` | Read a capability |
| GET | `/agent/intents` | `prsl.agent.registry.read` | List visible intents |
| GET | `/agent/intents/{intentId}` | `prsl.agent.registry.read` | Read an intent |
| GET | `/agent/skills` | `prsl.agent.registry.read` | List visible skills |
| GET | `/agent/skills/{skillId}` | `prsl.agent.registry.read` | Read a skill |
| GET | `/agent/agents` | `prsl.agent.registry.read` | List visible agents |
| GET | `/agent/agents/{agentId}` | `prsl.agent.registry.read` | Read an agent |
| GET | `/agent/policies` | `prsl.agent.registry.read` | List visible policy metadata |
| GET | `/agent/policies/{policyId}` | `prsl.agent.registry.read` | Read visible policy metadata |
| GET | `/agent/runtime/status` | `prsl.agent.runtime.read` | Read aggregate service health |
| GET | `/agent/providers/status` | `prsl.agent.runtime.read` | Read authorized provider health metadata |
| POST | `/agent/languages/detect` | `prsl.agent.languages.translate` | Detect language |
| POST | `/agent/languages/translate` | `prsl.agent.languages.translate` | Translate text |
| POST | `/agent/reason` | `prsl.agent.reasoning.execute` | Bounded analysis and recommendations |
| POST | `/agent/knowledge/search` | `prsl.agent.search` | Search approved knowledge sources |

The registry facade is read-only in v1. Registration, mutation, activation, policy editing, and execution administration remain separate privileged platform APIs.

## 7. Operation contracts

### 7.1 Chat — `POST /agent/chat`

Request fields:
- `message` (required, non-empty string; bounded by deployment configuration).
- `context.module` (optional module identifier).
- `context.locale` (optional BCP 47 language tag).
- `context.conversationId` (optional opaque conversation identifier).

Response fields:
- `response` (required user-facing answer).
- `sources` (array of source identifiers and/or document references).
- `correlationId` (required).
- `answerStatus` (one of `grounded`, `partial`, `insufficient_evidence`).

The Agent MUST distinguish documented facts from inference, cite available platform sources, and disclose insufficient evidence. It MUST NOT claim to have executed an action when it only provided instructions.

### 7.2 Discovery — `POST /agent/discover`

Request: `query` required; optional `domain`, `limit`, and `cursor`.

Response: arrays of identifiers for `intents`, `capabilities`, `skills`, `agents`, and `providers`, plus optional `nextCursor` and required `correlationId`. Results MUST be filtered through registry visibility and authorization rules.

### 7.3 Feedback — `POST /agent/feedback`

Request: `category`, `title`, and `description` required. Category is a controlled enum configured by the platform (initial values: `bug-report`, `feature-request`, `ux-feedback`, `documentation`, `other`). Optional contact details MUST be separately consented and MUST NOT be required for anonymous feedback unless an explicit product policy says otherwise.

Response: opaque `ticketId`, `status`, and `correlationId`. The endpoint MUST apply rate limits, input validation, abuse prevention, and retention policy.

### 7.4 Documentation search — `POST /agent/docs/search`

Request: `query` required; optional `domain`, `limit`, and `cursor`.

Response: `documents[]`, each containing `documentId`, `title`, optional `section`, `repository`, `path`, `version`, and `relevance`. Only published or explicitly discoverable documents may be returned.

### 7.5 Architecture explanation — `POST /agent/architecture/explain`

Request: `subject` required; optional `detailLevel` (`brief`, `standard`, `deep`) and `locale`.

Response: `summary`, `contracts[]`, `apiReferences[]`, and `correlationId`. References MUST resolve to known contract identifiers or repository paths; fabricated references are prohibited.

### 7.6 Registry facade

List endpoints accept `limit` and `cursor`; detail endpoints accept a stable path identifier. Responses MUST return canonical registry records or safe projections, not invented summaries. Sensitive policy internals, secrets, private provider configuration, and inaccessible tenant data MUST be omitted.

### 7.7 Runtime and provider diagnostics

Health states are `healthy`, `degraded`, `unavailable`, and `unknown`. Aggregate status MUST NOT imply every component is healthy. Provider status MUST NOT expose API keys, certificate material, account identifiers, prompts, or personal payloads. A provider may be reported as `not-configured` without treating the entire platform as unhealthy.

### 7.8 Linguistic services

Detection request: `text`; response: BCP 47 `language`, numeric `confidence` in [0,1], and `correlationId`.

Translation request: `source`, `target`, and `text`; response: `translatedText`, resolved source/target language tags, and `correlationId`. Translation MUST preserve user-provided meaning and MUST disclose when a requested language or quality level is unsupported. Accessibility and cultural adaptation are quality requirements, not permission to alter meaning.

### 7.9 Bounded reasoning

Request: `problem` required; optional `constraints[]`, `domain`, and `detailLevel`.

Response: `analysis`, `recommendations[]`, `assumptions[]`, `evidence[]`, and `correlationId`. This operation returns user-facing analysis only; it does not grant permission, dispatch arbitrary tools, or execute platform mutations.

### 7.10 Knowledge search

Request: `query` required; optional `domain`, `limit`, and `cursor`.

Response: `results[]` with `title`, `summary`, `sourceId`, and optional canonical reference, plus `correlationId`. Search must be restricted to approved knowledge sources and respect document visibility.

## 8. Operational and governance requirements

- All endpoints MUST use TLS. mTLS is additionally required for service identities where the PSP deployment profile mandates it.
- Read and write endpoints MUST have separate rate-limit policies. Feedback, chat, translation, and reasoning MUST have abuse and resource-consumption controls.
- Logs MUST minimize user content and MUST NOT include access tokens, refresh tokens, capability tokens, private keys, or raw credentials.
- Audit events MUST record security-relevant metadata and policy outcomes without retaining unnecessary message content.
- Health checks MUST be read-only and MUST NOT trigger provider inference.
- Timeouts, retries, circuit breakers, and provider fallback MUST be governed by platform policy. Provider fallback MUST NOT bypass privacy, consent, locality, or capability constraints.
- All outputs MUST be accessibility-aware and localizable. The service MUST NOT assume English-only input.
- The Agent MUST report unavailable integrations as unavailable; it MUST NOT fabricate registry entries, providers, sources, health states, ticket IDs, or execution results.

## 9. Implementation conformance

An implementation is conformant only when:
1. An OpenAPI document validates against OpenAPI 3.1.
2. Request and response schemas validate positive and negative test vectors.
3. Scope enforcement is tested for every operation.
4. Public-client PKCE and server-side mTLS requirements are verified at the deployment boundary.
5. Registry visibility and diagnostics redaction are tested.
6. Rate limits, correlation IDs, error envelopes, and safe logging are tested.
7. Contract tests verify that undocumented or unimplemented operations are not advertised as available.
8. A deployment record identifies the commit, configuration profile, and verified endpoint set.

## 10. Relationship to existing specifications

- [Agent PRSL-AI architecture](./README.md) defines identity, scope, and repository placement.
- [Capability Registry Specification](./registry-specification.md) defines registration and discovery authority.
- [Capability Contract](./capability-contract.md) defines capability records.
- [Permission Manager Specification](./permission-manager-specification.md) defines protected-operation authorization.
- [PRSL-AI Security Profile](../security/PRSL-AI-SECURITY-PROFILE.md) defines platform security profiles.
- [Platform Agent Specification (PAS)](../PRSL-AI-AGENT.md) defines the Agent's institutional and architectural responsibilities.

## 11. Status

PAS-TC 1.0.0 is a proposed technical contract. It is not evidence that the API server, endpoints, OAuth issuer, mTLS deployment, feedback backend, diagnostic adapters, or external intelligence providers are live. Implementations MUST publish their verified operation status separately.
