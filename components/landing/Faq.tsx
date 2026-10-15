const QUESTIONS = [
  {
    q: 'Zavazuje mě odeslání konfigurace k něčemu?',
    a: 'Ne. Je to poptávka. Ozveme se, projdeme ji s vámi a teprve potom se rozhodnete.',
  },
  {
    q: 'Můžu později změnit barvy nebo pořadí sekcí?',
    a: 'Ano. Konfigurace není definitivní — stačí nám napsat.',
  },
  {
    q: 'Co když už doménu mám a běží na ní e-mail?',
    a: 'Nastavíme jen záznamy potřebné pro web a vaší poště se nedotkneme.',
  },
  {
    q: 'Kdo bude web spravovat?',
    a: 'Obsah vy — nemovitosti, fotky, články. Technický provoz, zálohy a aktualizace my.',
  },
  {
    q: 'Můžu převést nabídky z jiného webu nebo portálu?',
    a: 'Domluvíme se. Napište nám, kolik nemovitostí nabízíte a odkud.',
  },
]

export function Faq() {
  return (
    <section className="border-t border-line bg-white/60">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight">Časté otázky</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {QUESTIONS.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="text-xl text-ink-soft transition group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
