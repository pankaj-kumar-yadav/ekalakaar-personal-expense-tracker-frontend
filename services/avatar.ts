const DICEBEAR_LORELEI_SVG =
  "https://api.dicebear.com/10.x/lorelei/svg"

/** Stable Lorelei avatar URL seeded by the user's email. */
export function getUserAvatarUrl(email: string): string {
  const seed = email.trim().toLowerCase()
  const params = new URLSearchParams({ seed })
  return `${DICEBEAR_LORELEI_SVG}?${params.toString()}`
}
