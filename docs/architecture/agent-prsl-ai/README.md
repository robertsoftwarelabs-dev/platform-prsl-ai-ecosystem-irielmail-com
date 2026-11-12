# Agent PRSL-AI Architecture

**Owner:** Robert Software Labs  
**Ecosystem:** PRSL-AI Ecosystem  
**Canonical agent identity:** `@prsl-ai.agent.prsl.ai`  
**Parent platform identity:** `@prsl-ai.prsl.ai.ecosystem`  
**Institutional signature:** Powerful by Robert Software Labs  
**Repository placement:** First-party component in the canonical PRSL-AI platform repository  
**Document status:** Architecture specification; implementation status is component-specific

This documentation defines Agent PRSL-AI as the specialized platform agent within the PRSL-AI Ecosystem. It distinguishes architectural definitions from implementation status: inclusion in this catalog does not claim that a module, API, provider, adapter, or runtime is already implemented.

## Identity and scope

- **Agent PRSL-AI** is the first-party specialized agent identity for institutional and technical knowledge of the PRSL-AI Ecosystem and authorized platform tasks.
- **Powerful by Robert Software Labs** is its institutional signature; it is not a model/provider name and does not imply unrestricted autonomy.
- **iRiel AI** is the distinct Personal Intelligence Environment (PIE) that coordinates the user's broader personal intelligence experience.
- **Capability modules** group related specialist functions.
- **Capabilities** are individually identified operations with explicit input/output contracts.
- **PRSL-AI policy and routing** govern candidate selection, permissions, provider choice, and execution boundaries.
- **The Permission Manager** is the only PRSL-AI component that issues authorization decisions for protected operations.
- **Human authority** remains the source of user intent and consent.

> The model thinks. The agent executes a specialty. The Router decides. iRiel orchestrates.

## Repository and module boundary

The canonical repository is the PRSL-AI Ecosystem platform repository. Agent-specific code, tests, manifests, evaluations, and documentation remain identifiable as Agent-owned modules within that repository. Shared policy, routing, registry, Permission Manager, and common schemas remain platform-owned contracts; the Agent consumes them and must not fork or privately redefine them.

An independent Agent repository is a future option only if deployment, distribution, team permissions, compliance, or release requirements establish a real need. Such a split requires an approved migration and compatibility plan.

## Documents

| Document | Purpose |
|---|---|
| [Agent PRSL-AI institutional and architectural specification](../PRSL-AI-AGENT.md) | Canonical identity, specialization, responsibilities, and boundaries. |
| [PRSL-AI Agent Technical Contracts (PAS-TC)](./technical-contracts.md) | HTTP operations, request/response semantics, OAuth scopes, mTLS boundaries, errors, and conformance requirements. |
| [OpenAPI 3.1 contract](../../../openapi/agent/prsl-ai-agent.v1.yaml) | Machine-readable API contract for the Agent API. |
| [Platform, Agent, and Repository Governance](../PLATFORM-AGENT-REPOSITORY-GOVERNANCE.md) | Ownership, module boundaries, dependency direction, and release governance. |
| [Capability Registry Specification](./registry-specification.md) | Registration, discovery, lifecycle, and dispatch governance. |
| [Capability Contract](./capability-contract.md) | Shared capability record contract. |
| [Permission Manager Specification](./permission-manager-specification.md) | Authorization authority and protected-operation enforcement. |
| [iRiel AppWeb integration contract](../IRIEL-APPWEB-INTEGRATION.md) | Consumer boundary between iRiel AppWeb and the platform. |

## Implementation status

PAS-TC and the OpenAPI document are specifications. They do not prove that the API server, routes, OAuth issuer, mTLS deployment, feedback backend, diagnostics adapters, or external intelligence providers are live. Implementations MUST publish verified operation status separately and MUST pass the conformance requirements in PAS-TC before being advertised as available.
