# Codex project instructions

This repository contains the historical M1 static prototype and the planned ConectaNegocio React frontend. Before planning or editing, read `docs/project-definition.md` and `docs/architecture-principles.md`; the M1 `README.md` describes the earlier milestone and is not the new React specification.

- Use OpenSpec's `spec-driven` workflow for new application work: proposal → specs → design → tasks, then implementation when requested. Do not infer approval to implement from a planning request.
- Preserve existing user code, docs, and Git history. Work locally only. Never push, modify remotes, create or modify PRs, deploy, or commit unless a later explicit user request authorizes the specific action.
- Build a functional React/Vite frontend with mock data only. Be honest about simulated authentication, payments, invoices, analysis, and chat. Do not add a backend or an unapproved technology.
- Keep products and other entities as single sources of truth linked by stable IDs. Centralize business mutations, never mutate React state directly, and derive reports and totals from source state.
- Enforce role/subrole permissions in both navigation and protected routes. A direct URL must not bypass a restriction.
- Keep each React component at or below 80 lines. Use `useEffect` only for justified synchronization/lifecycle behavior, with correct dependencies and cleanup. Avoid direct DOM manipulation.
- Preserve the course rubric: dynamic route with `useParams`, protected redirect, explainable custom hook, traceable state transitions, responsive accessible UI, and eventual static-host compatibility. Do not deploy during planning.
