# Permission Manager Runtime Core

This module contains two implementation slices:

- `decision-gate.ts`: deterministic binding checks for a decision returned by a trusted Permission Manager.
- `runtime.ts`: framework-neutral orchestration for request evaluation and the immediate pre-execution verification gate.

## Runtime evaluation sequence

The runtime validates the request contract, authenticates the subject through an injected trusted adapter, resolves the exact capability record, enforces registered/validated/review-approved/verified lifecycle state, confirms the declared permission and allowed execution mode, evaluates current policy, verifies consent when required, verifies native host permission when required, and independently verifies remote-disclosure evidence when policy requires it.

Only after those checks does it ask the trusted decision authority to issue a short-lived, single-use decision. The grant expiry is bounded by the requested duration, the 15-minute ceiling, and the capability execution timeout.

Immediately before protected access, `verifyForExecution` repeats identity, registry, policy, consent, native permission, and remote-disclosure checks. It then calls the trusted decision authority's atomic `verifyAndConsume` operation. A read followed by a separate consume is not acceptable because it permits replay races.

## Required adapter contracts

The runtime uses dependency-injected ports:

- **Authenticator:** verifies the server-side authentication context and returns the authoritative principal. Request-supplied subject fields are never trusted on their own.
- **Capability Registry:** returns the registered manifest, digest, validation status, and review status. Only a registered record with passing validation, approved review, and a `verified` manifest is eligible.
- **Policy Engine:** evaluates current policy and returns policy version, consent/native permission requirements, and whether independent remote-disclosure authorization is required.
- **Consent Authority:** verifies affirmative, subject-bound, purpose- and scope-specific evidence. It does not infer consent from conversation content.
- **Native Permission Adapter:** checks the operating-system or host permission independently.
- **Remote Disclosure Authority:** verifies a separate authorization for the exact remote recipient and disclosure scope; local resource access never implies remote disclosure.
- **Decision Authority:** issues the canonical decision and atomically verifies, checks revocation/expiry/binding, and consumes a one-time decision at execution time.
- **Audit Sink:** records minimized decision metadata before issuance and after execution verification. Audit events exclude payloads, prompts, tokens, media, and precise location.

All ports are mandatory. An unavailable or throwing dependency results in a safe rejection. The runtime does not provide permissive defaults.

## Security boundary and implementation status

**Implemented:** request/decision contract validation, dependency-injected evaluation orchestration, registry eligibility checks, policy/consent/native/remote-disclosure gates, bounded decision lifetime, decision binding verification, pre-execution re-evaluation, atomic-consumption interface, and minimized audit interface.

**Not implemented:** production adapters, authenticated HTTP transport, persistent registry, policy engine, consent store, native OS integration, remote-disclosure decision store, cryptographic decision signing, atomic replay/revocation storage, durable audit storage, deployment, or production authorization.

The adapter interfaces are contracts, not live services. Test fixtures use synthetic principals and a synthetic verified registry record; they do not promote any real capability. The current example capability manifests remain `specified`, so they are not eligible for protected execution.

Do not expose this module to browser code as an authorization authority. Do not let a capability, model, provider, tool, or client create its own adapters or decision. Protected resource access must remain behind a trusted server/host execution boundary. Until production adapters and deployment are independently verified, protected execution remains disabled or fail-closed.

## Validation

Run `bun run test`, `bunx tsc --noEmit`, and the repository's Python contract validators from the repository root.
