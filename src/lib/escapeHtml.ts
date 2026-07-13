// Minimal HTML entity escaping for user-supplied strings interpolated
// into HTML (e.g. the contact-form notification email). Escapes the
// five characters that can break out of text or attribute contexts.
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
