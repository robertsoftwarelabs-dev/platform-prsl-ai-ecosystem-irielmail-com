# PRSL-AI Ecosystem Platform

**Created and stewarded by Robert Software Labs (RSL).**

The **PRSL-AI Ecosystem** is a modular technology platform for artificial intelligence, accessibility, inclusion, privacy, security, and human-centered innovation. It defines shared architecture, policies, contracts, infrastructure, specialized capabilities, and integration boundaries for independently evolving products and services.

> **Accessibility, Inclusion, and Security by Default.**  
> Your continuity is your right.  
> The machine adapts to you.

## Official destinations

| Destination | Purpose |
|---|---|
| [PRSL-AI Ecosystem platform](https://platform-prsl-ai-ecosystem-irielmail-com.lovable.app) | Official platform website |
| [Ecosystem architecture page](https://platform-prsl-ai-ecosystem-irielmail-com.lovable.app/ecosystem) | Public overview of the ecosystem |
| [iRiel AppWeb](https://iriel-prsl-ai-irielmail-com.lovable.app) | Separate iRiel application |
| [GitHub repository](https://github.com/iRiel-AI-Environment/platform-prsl-ai-ecosystem-irielmail-com) | Source code and canonical platform documentation |

The platform and iRiel are separate projects and deployments. This repository is the PRSL-AI platform repository; it is not the iRiel AppWeb repository.

## Product and architectural boundaries

| Identity | What it is | What it is not |
|---|---|---|
| **Robert Software Labs (RSL)** | Creator and institutional steward | A model or runtime component |
| **PRSL-AI Ecosystem** | Shared platform architecture, governance, contracts, and capabilities | A single chatbot, model, or application |
| **PRSL-AI Core** | Foundational platform architecture and infrastructure | A model or independent product identity |
| **Intelligence Router** | Selects eligible execution candidates under policy constraints | An authorization authority |
| **Permission Manager** | Issues authorization decisions for protected PRSL-AI operations | A model router or UI toggle |
| **Agent PRSL-AI** | First-party specialist for PRSL-AI platform knowledge and authorized platform tasks | iRiel or the platform itself |
| **iRiel AI** | Separate **PowerFully Intelligence Environment** that coordinates a person's broader intelligence experience | An AI model, the PRSL-AI platform, or Agent PRSL-AI |
| **iSpace** | Personal workspace within iRiel | A peer platform or separate top-level product |
| **iApps** | Modular application family | A replacement name for the platform or its agents |

Canonical iRiel wording is **“PowerFully Intelligence Environment”**. Preserve the exact branded capitalization. Do not use the historical expansion “Personal Intelligence Environment (PIE)” as its definition.

### Responsibility flow

**Human intent → Context → Policy → Intelligence Router → Capability / Provider**

> The model thinks. The agent executes a specialty. The Router decides. iRiel orchestrates.

“Router decides” means selecting an eligible execution candidate. It does not mean granting permission. Protected operations require the Permission Manager and, where applicable, independent operating-system permissions.

## Foundational principles

1. Accessibility by default.
2. Inclusion by default.
3. Security by default.
4. Privacy by default and data minimization.
5. On-device and local execution first where technically suitable.
6. Provider-agnostic architecture through explicit adapters and contracts.
7. Human control, explicit consent, and purpose limitation.
8. Modular components with independent responsibilities and lifecycles.

Local, platform-hosted, and external execution must be distinguishable. A failed local route must never trigger an unauthorized remote fallback.

## Current implementation status

The website and repository contain a mixture of implemented interface elements, architectural specifications, partial code, and planned infrastructure. These categories must not be presented as equivalent.

| Area | Current documented status |
|---|---|
| Platform website | Implemented as a Lovable-hosted web application; individual pages and behaviors remain subject to testing |
| Language registry | 17 BCP 47 locales registered |
| Translation completeness | en-US and pt-BR have complete core message sets; other locales have partial native UI overrides and fallback content |
| Agent PRSL-AI console | Known-topic matching is local; unmatched questions require explicit consent before remote inference |
| Current remote Agent fallback | Lovable AI Gateway, currently configured with OpenAI GPT-6 Astra; this is a provider-specific implementation, not proof of a provider-agnostic runtime |
| PRSL-AI Intelligence Infrastructure | Architecture specified; not implemented as a complete operational infrastructure |
| Intelligence Router runtime | Architectural responsibility defined; production routing runtime is not verified |
| Permission Manager | Partial runtime core and contract tests exist; trusted production adapters and deployment are not established |
| Capability examples | Manifests and contracts are specified; examples are not automatically production-registered or dispatch-eligible |
| Accessibility conformance | WCAG 2.2 AA is a target; conformance requires automated and manual verification |

The [Implementation Readiness and Architecture Gap Register](docs/architecture/IMPLEMENTATION-READINESS-AND-GAP-REGISTER.md) is the authoritative record of known production blockers and required evidence. Do not infer operational readiness from a page, diagram, manifest, or passing synthetic test.

## Agent PRSL-AI and remote inference

The current Agent console first checks its local knowledge topics. If it cannot match a topic, it must ask the user before sending the question to the remote AI service.

When the user explicitly approves:
- The question text is sent to the Lovable AI Gateway.
- The gateway is currently configured to use OpenAI GPT-6 Astra.
- The current request does not include the user's iRiel profile, personal memory, or conversation history.
- Declining remote inference keeps the question on the local path.

This is a **UI-level consent step** for the public Agent Q&A flow. The request also carries an explicit consent assertion, but that client-provided value is not a trusted authorization authority and can be bypassed by a direct API caller. It does not replace the production Remote Disclosure Authority tracked as GAP-007. Do not send protected or sensitive personal data through this public fallback. The provider-specific gateway must not be described as provider-agnostic until a replaceable adapter contract and implementation are in place.

## Architecture documentation

Start here:

- [Architecture documentation index](docs/architecture/README.md)
- [Canonical ecosystem architecture overview](docs/architecture/PRSL-AI-ECOSYSTEM-ARCHITECTURE-OVERVIEW.md)
- [Implementation readiness and gap register](docs/architecture/IMPLEMENTATION-READINESS-AND-GAP-REGISTER.md)
- [PRSL-AI Intelligence Infrastructure](docs/architecture/PRSL-AI-INTELLIGENCE-INFRASTRUCTURE.md)
- [Agent PRSL-AI specification](docs/architecture/PRSL-AI-AGENT.md)
- [Canonical iRiel definition](docs/architecture/IRIEL-POWERFULLY-INTELLIGENCE-ENVIRONMENT.md)
- [iRiel ↔ PRSL-AI integration contract](docs/architecture/IRIEL-APPWEB-INTEGRATION.md)
- [Platform and Agent repository governance](docs/architecture/PLATFORM-AGENT-REPOSITORY-GOVERNANCE.md)

## Development

### Requirements

- Node.js compatible with the versions used by the project toolchain.
- [Bun](https://bun.sh/) for dependency installation and scripts.
- Python 3.12 for architecture and capability validators.

### Setup

~~~bash
git clone https://github.com/iRiel-AI-Environment/platform-prsl-ai-ecosystem-irielmail-com.git
cd platform-prsl-ai-ecosystem-irielmail-com
cp .env.example .env
bun install --frozen-lockfile
bun run dev
~~~

Configure the environment variables in .env using your authorized development values. Never commit .env or real credentials.

### Validation

~~~bash
bun run lint
bun run test
bunx tsc --noEmit
bun run build
python -m pip install -r docs/architecture/agent-prsl-ai/requirements-dev.txt
python docs/architecture/scripts/validate_architecture_links.py
python docs/architecture/agent-prsl-ai/scripts/validate_capability_manifests.py
python docs/architecture/agent-prsl-ai/scripts/validate_permission_manager.py
python docs/architecture/agent-prsl-ai/scripts/validate_execution_contract.py
python docs/architecture/agent-prsl-ai/scripts/validate_dependency_resolver.py
~~~

GitHub Actions runs the architecture-link, capability-manifest, Permission Manager, execution-contract, Dependency Resolver, application-test, and type-check validations for the configured change paths. Run the relevant checks locally before opening a pull request.

## Repository change rules

- Keep PRSL-AI platform work in this repository.
- Keep iRiel AppWeb implementation work in its separate repository and Lovable project.
- Do not copy .env files, credentials, provider tokens, or private runtime state between projects.
- Preserve published Lovable-connected Git history; never force-push or rewrite published commits.
- Update architecture documentation when contracts, responsibilities, or implementation status change.
- State clearly whether work is **specified**, **implemented**, **verified**, **available**, **planned**, or **blocked**.

---

**Robert Software Labs**  
**PRSL-AI Ecosystem**  
*Accessibility. Inclusion. Security. Human-centered intelligence.*
