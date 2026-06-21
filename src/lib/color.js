// Darkens a hex color by a percentage — used to derive an accessible
// gold variant for small text on light (cream) backgrounds, since the
// admin-configurable gold accent is often too light to pass WCAG AA
// contrast at small sizes on its own.
export function darken(hex, amount = 35) {
  const m = hex.replace('#', '')
  const num = parseInt(m.length === 3 ? m.split('').map(c => c + c).join('') : m, 16)
  const factor = 1 - amount / 100
  const r = Math.max(0, Math.round(((num >> 16) & 255) * factor))
  const g = Math.max(0, Math.round(((num >> 8) & 255) * factor))
  const b = Math.max(0, Math.round((num & 255) * factor))
  return `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`
}
