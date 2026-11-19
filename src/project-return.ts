// Stash for Detail → Projects carousel restore when navigate(-1) (no location.state).
// shortcut: stale if back lands off /projects (e.g. Work→Detail); clear there if it becomes an issue.
let pendingProjectSlug: string | null = null

export const stashProjectSlug = (slug: string) => {
  pendingProjectSlug = slug
}

export const peekProjectSlug = () => pendingProjectSlug

export const takeProjectSlug = () => {
  const s = pendingProjectSlug
  pendingProjectSlug = null
  return s
}
