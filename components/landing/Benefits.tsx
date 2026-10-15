const ITEMS = [
  { title: 'Administrace v češtině', body: 'Přidat nemovitost zvládnete z mobilu. Fotky se samy zmenší a odstraní se z nich poloha.' },
  { title: 'Vlastní doména', body: 'Web běží na vaší adrese. Do té doby na dočasné, aby se nemuselo na nic čekat.' },
  { title: 'Energetický štítek pohlídáme', body: 'Bez třídy PENB inzerát nezveřejníte — zákon ji vyžaduje a web na ni nezapomene.' },
  { title: 'Poptávky rovnou k vám', body: 'Zájemci píšou přes formulář u každé nemovitosti. Víte, na kterou se ptají.' },
  { title: 'Rychlý a dohledatelný', body: 'Moderní technologie, rychlé načítání na mobilu a stránky připravené pro vyhledávače.' },
  { title: 'Aktualizace bez starostí', body: 'Opravy a vylepšení šablony dostanete automaticky. Nic neinstalujete.' },
]

export function Benefits() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight">Co dostanete</h2>
      <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => (
          <div key={item.title} className="border-t border-line pt-5">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
