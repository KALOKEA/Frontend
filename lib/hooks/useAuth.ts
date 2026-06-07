// DEPRECATED — do NOT import this hook. Auth bootstrapping is handled by
// components/AuthBootstrap.tsx (mounted once in app/layout.tsx).
// This file is kept to avoid breaking any stale import; it exports a no-op.
// TODO: run `git rm lib/hooks/useAuth.ts` and remove any stale imports.
export function useAuthInit() { /* no-op */ }
