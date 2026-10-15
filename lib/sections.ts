/**
 * Czech names for home section ids.
 *
 * The ids come from the theme manifest (`sections.home`); their labels do not,
 * yet. Unknown ids fall back to the id itself so a new section is visible
 * rather than missing. Labels belong in the manifest — move them there when a
 * second theme brings sections this list has never heard of.
 */
const LABELS: Record<string, { label: string; hint: string }> = {
  hero: { label: 'Úvodní banner', hint: 'Velká fotka, hlavní sdělení a vyhledávání' },
  featured: { label: 'Vybrané nemovitosti', hint: 'Nabídky, které chcete ukázat jako první' },
  services: { label: 'Služby', hint: 'Co pro klienty děláte' },
  agent: { label: 'O makléři', hint: 'Vaše fotka, příběh a kontakt' },
  stats: { label: 'Čísla a výsledky', hint: 'Prodané nemovitosti, roky praxe, hodnocení' },
  contact: { label: 'Kontaktní formulář', hint: 'Poptávka přímo z webu do vaší schránky' },
  blog: { label: 'Blog', hint: 'Nejnovější články' },
}

export function sectionLabel(id: string): string {
  return LABELS[id]?.label ?? id
}

export function sectionHint(id: string): string | undefined {
  return LABELS[id]?.hint
}
