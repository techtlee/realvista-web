const STEPS = [
  {
    title: 'Nastavíte si web',
    body: 'V konfigurátoru níže vyberete šablonu, barvy a sekce. Náhled se mění s každým kliknutím.',
  },
  {
    title: 'Projdeme to spolu',
    body: 'Ozveme se, doladíme detaily a domluvíme doménu. Pokud na ní máte e-mail, nesáhneme na něj.',
  },
  {
    title: 'Web běží, vy prodáváte',
    body: 'Spustíme ho na vaší doméně. Nemovitosti, fotky a články pak přidáváte sami v české administraci.',
  },
]

export function HowItWorks() {
  return (
    <section id="jak-to-funguje" className="scroll-mt-6 border-y border-line bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Jak to funguje</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="font-display text-5xl font-medium text-accent">{i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
