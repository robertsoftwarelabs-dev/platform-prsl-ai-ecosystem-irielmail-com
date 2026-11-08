<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Repository identity and scope

This repository is the **PRSL-AI Ecosystem platform** project owned by Robert Software Labs. Its public platform deployment is:

- Platform: https://platform-prsl-ai-ecosystem-irielmail-com.lovable.app
- Ecosystem page: https://platform-prsl-ai-ecosystem-irielmail-com.lovable.app/ecosystem

The separate iRiel AppWeb is deployed at https://iriel-prsl-ai-irielmail-com.lovable.app and has its own repository and Lovable project. Do not treat this repository as the iRiel AppWeb source, and do not modify the iRiel repository as part of platform work unless the task explicitly spans both projects and authorizes both.

# Canonical identities

- **Robert Software Labs (RSL):** creator and institutional steward.
- **PRSL-AI Ecosystem:** shared platform architecture, governance, contracts, and capabilities.
- **PRSL-AI Core:** foundational platform architecture and infrastructure; do not imply complete operational implementation without evidence.
- **Agent PRSL-AI:** first-party specialist for PRSL-AI platform knowledge and authorized platform tasks.
- **iRiel AI:** separate **PowerFully Intelligence Environment**. Preserve this exact branded wording and capitalization; do not use the historical “Personal Intelligence Environment (PIE)” expansion.
- **iSpace:** a workspace inside iRiel, not a peer platform or independent top-level product.
- **iApps:** the modular application family.

The canonical principle is: **Accessibility, Inclusion, and Security by Default. Your continuity is your right. The machine adapts to you.**

The responsibility statement is: **The model thinks. The agent executes a specialty. The Router decides. iRiel orchestrates.** Router selection is not authorization; protected operations require the Permission Manager and applicable host permissions.

# Source-of-truth documentation

- README.md — repository identity, destinations, implementation status, and development workflow.
- docs/architecture/README.md — architecture documentation index.
- docs/architecture/PRSL-AI-ECOSYSTEM-ARCHITECTURE-OVERVIEW.md — canonical ecosystem architecture and responsibility boundaries.
- docs/architecture/IMPLEMENTATION-READINESS-AND-GAP-REGISTER.md — authoritative known gaps and production-readiness evidence.
- docs/architecture/IRIEL-POWERFULLY-INTELLIGENCE-ENVIRONMENT.md — canonical iRiel definition.
- docs/architecture/IRIEL-APPWEB-INTEGRATION.md — cross-project integration contract.
- docs/architecture/PLATFORM-AGENT-REPOSITORY-GOVERNANCE.md — ownership and repository placement.

# Internationalization

- UI copy is maintained in src/i18n/messages.ts.
- Locale identifiers and metadata are maintained in src/i18n/locales.ts.
- Native interface overrides are maintained in src/i18n/locales/overrides.ts.
- The registry contains 17 BCP 47 locales. Only en-US and pt-BR have complete core message sets; the other locales have partial native UI overrides and use fallback content for missing messages.
- Do not describe all 17 locales as fully translated. Preserve RTL behavior and verify locale-specific text before marking a locale complete.

# Agent console and remote inference

- Local topic matching is implemented in src/lib/agent.ts.
- Known-topic answers are resolved locally.
- Unmatched questions must **not** be transmitted automatically. The UI must obtain explicit user approval before calling askAgent in src/lib/ai/agent.functions.ts, and the request schema requires an explicit consent assertion.
- The consent assertion is client-provided and is not a trusted authorization authority. Never treat it as permission to disclose protected data or execute protected platform capabilities. The production Remote Disclosure Authority remains an open gap (GAP-007).
- The current server gateway is src/lib/ai/gateway.server.ts. It uses the Lovable AI Gateway and is currently configured with OpenAI GPT-6 Astra. This is a provider-specific implementation; do not claim a provider-agnostic runtime until replaceable provider adapters and contract tests exist.
- The current remote request sends the question text only. Do not add profile, personal memory, conversation history, secrets, or unrelated context to the remote request.
- Any change to destination, model, payload, consent UX, or retention behavior requires updates to the privacy copy, tests, and architecture status.

# Security and configuration

- Use .env.example for variable names and safe placeholders.
- Never commit .env, secrets, service-role keys, access tokens, credentials, or generated private state.
- Do not expose server-only environment variables to browser code.
- SUPABASE_PUBLISHABLE_KEY / VITE_SUPABASE_PUBLISHABLE_KEY are publishable client configuration; service-role credentials are not.
- Keep authorization, consent, native host permissions, remote disclosure, and data retention as separate controls.

# Engineering and validation

- Keep modules cohesive and respect the documented platform/client boundary.
- Do not describe architecture, examples, mocks, or synthetic tests as production deployment.
- Update documentation and tests when implementation behavior or contracts change.
- Run the relevant checks before opening a pull request:
  - bun run lint
  - bun run test
  - bunx tsc --noEmit
  - bun run build
  - python docs/architecture/scripts/validate_architecture_links.py
  - Capability, Permission Manager, execution-contract, and Dependency Resolver validators under docs/architecture/agent-prsl-ai/scripts/.
- Preserve Lovable-connected Git history. Never force-push, amend, rebase, or squash commits already published to the connected branch.
