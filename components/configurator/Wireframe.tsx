import { sectionLabel } from '@/lib/sections'

/**
 * A schematic of the site, in the chosen colour and section order.
 *
 * Shown while the real preview loads, and instead of it when the preview
 * route is unreachable. Deliberately abstract — grey bars, not fake listings —
 * so nobody mistakes it for the product. The real thing is the iframe.
 */
export function Wireframe({
  sections,
  color,
  brand,
  tagline,
  compact = false,
}: {
  sections: string[]
  color: string
  brand: string
  tagline?: string
  compact?: boolean
}) {
  return (
    <div
      className="flex h-full flex-col overflow-hidden bg-white text-[10px] text-neutral-800"
      style={{ ['--wf' as string]: color }}
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5">
        <span className="truncate font-semibold" style={{ color }}>
          {brand || 'Vaše realitní kancelář'}
        </span>
        <span className="flex gap-2">
          {[28, 22, 30, 18].map((w, i) => (
            <Bar key={i} w={w} />
          ))}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-hidden p-3">
        {sections.map((id) => (
          <Block key={id} id={id} color={color} brand={brand} tagline={tagline} compact={compact} />
        ))}
      </div>
    </div>
  )
}

function Block({
  id,
  color,
  brand,
  tagline,
  compact,
}: {
  id: string
  color: string
  brand: string
  tagline?: string
  compact: boolean
}) {
  const label = compact ? null : (
    <span className="mb-1.5 block text-[9px] font-medium uppercase tracking-wider text-neutral-400">
      {sectionLabel(id)}
    </span>
  )

  switch (id) {
    case 'hero':
      return (
        <div className="shrink-0 rounded-md p-4 text-white" style={{ background: color }}>
          <div className="text-[13px] font-semibold leading-tight">{brand || 'Najdeme vám nový domov'}</div>
          <div className="mt-1 opacity-70">{tagline || 'Prodej, pronájem a ocenění nemovitostí'}</div>
          <div className="mt-3 flex gap-1.5 rounded bg-white/95 p-1.5">
            <Bar w={60} tone="bg-neutral-200" />
            <Bar w={40} tone="bg-neutral-200" />
            <span className="ml-auto h-3 w-10 rounded-sm" style={{ background: color }} />
          </div>
        </div>
      )
    case 'featured':
      return (
        <div className="shrink-0">
          {label}
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="overflow-hidden rounded border border-neutral-100">
                <div className="aspect-[4/3] bg-neutral-200" />
                <div className="space-y-1 p-1.5">
                  <Bar w={50} />
                  <Bar w={30} tone="" style={{ background: color, opacity: 0.8 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    case 'services':
      return (
        <div className="shrink-0">
          {label}
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1 rounded bg-neutral-50 p-2">
                <span className="h-4 w-4 rounded-full" style={{ background: color, opacity: 0.85 }} />
                <Bar w={30} />
              </div>
            ))}
          </div>
        </div>
      )
    case 'agent':
      return (
        <div className="flex shrink-0 items-center gap-3 rounded bg-neutral-50 p-3">
          <span className="h-10 w-10 shrink-0 rounded-full bg-neutral-300" />
          <div className="flex-1 space-y-1.5">
            {label}
            <Bar w={70} />
            <Bar w={90} />
          </div>
        </div>
      )
    case 'stats':
      return (
        <div className="shrink-0">
          {label}
          <div className="grid grid-cols-3 gap-2">
            {['120+', '15 let', '4,9★'].map((n) => (
              <div key={n} className="rounded border border-neutral-100 p-2 text-center">
                <div className="text-[12px] font-semibold" style={{ color }}>
                  {n}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    case 'contact':
      return (
        <div className="shrink-0 rounded border border-neutral-100 p-3">
          {label}
          <div className="grid grid-cols-2 gap-1.5">
            <span className="h-3 rounded-sm bg-neutral-100" />
            <span className="h-3 rounded-sm bg-neutral-100" />
            <span className="col-span-2 h-6 rounded-sm bg-neutral-100" />
          </div>
          <span className="mt-2 block h-3 w-14 rounded-sm" style={{ background: color }} />
        </div>
      )
    case 'blog':
      return (
        <div className="shrink-0">
          {label}
          <div className="grid grid-cols-2 gap-2">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-1.5">
                <span className="h-8 w-10 shrink-0 rounded-sm bg-neutral-200" />
                <div className="flex-1 space-y-1">
                  <Bar w={80} />
                  <Bar w={50} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    default:
      return (
        <div className="shrink-0 rounded border border-dashed border-neutral-200 p-3">
          {label}
          <Bar w={60} />
        </div>
      )
  }
}

function Bar({ w, tone = 'bg-neutral-200', style }: { w: number; tone?: string; style?: React.CSSProperties }) {
  return <span className={`block h-1.5 rounded-full ${tone}`} style={{ width: `${w}%`, minWidth: 12, ...style }} />
}
