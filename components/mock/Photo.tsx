import type { PhotoKind } from '@/lib/mock-data'

/**
 * A placeholder photograph: a soft gradient sky and ground with a simple
 * silhouette. Generated, so nothing loads from outside and nothing can look
 * like a real client's property. Deliberately not in the brand colour — real
 * photos won't be either.
 */
const PALETTES = [
  ['#c9d7e3', '#e8e2d6', '#9aa79b'],
  ['#d9cfc3', '#efe9df', '#a39a88'],
  ['#c4d1d9', '#e4e8e6', '#8e9c97'],
  ['#d6d2e0', '#ece8ef', '#9c97a8'],
  ['#cfd9cf', '#eaeee4', '#8fa08a'],
  ['#e0d3c6', '#f1e9de', '#ab9682'],
] as const

export function Photo({
  kind,
  seed = 0,
  className = '',
  rounded = '',
}: {
  kind: PhotoKind
  seed?: number
  className?: string
  rounded?: string
}) {
  const [sky, light, ground] = PALETTES[seed % PALETTES.length]!
  const id = `p${kind}${seed}`
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={`block h-full w-full ${rounded} ${className}`}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky} />
          <stop offset="1" stopColor={light} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}s)`} />
      <Silhouette kind={kind} ground={ground} light={light} />
    </svg>
  )
}

function Silhouette({ kind, ground, light }: { kind: PhotoKind; ground: string; light: string }) {
  const g = { fill: ground }
  switch (kind) {
    case 'house':
      return (
        <g>
          <rect y="232" width="400" height="68" fill={ground} opacity="0.55" />
          <path d="M120 232V150l80-58 80 58v82z" {...g} />
          <rect x="150" y="170" width="28" height="28" fill={light} />
          <rect x="222" y="170" width="28" height="28" fill={light} />
          <rect x="186" y="196" width="28" height="36" fill={light} opacity="0.8" />
          <circle cx="330" cy="200" r="34" fill={ground} opacity="0.7" />
          <rect x="327" y="210" width="6" height="24" fill={ground} />
        </g>
      )
    case 'flat':
      return (
        <g>
          <rect x="120" y="60" width="160" height="240" {...g} />
          {Array.from({ length: 6 }, (_, r) =>
            [0, 1, 2, 3].map((c) => (
              <rect key={`${r}${c}`} x={136 + c * 36} y={78 + r * 36} width="22" height="22" fill={light} opacity="0.85" />
            )),
          )}
          <rect x="40" y="150" width="70" height="150" fill={ground} opacity="0.5" />
          <rect x="290" y="120" width="80" height="180" fill={ground} opacity="0.5" />
        </g>
      )
    case 'city':
      return (
        <g fill={ground}>
          <rect x="20" y="140" width="70" height="160" opacity="0.6" />
          <rect x="100" y="90" width="80" height="210" />
          <rect x="190" y="120" width="60" height="180" opacity="0.75" />
          <rect x="260" y="70" width="90" height="230" />
          <rect x="355" y="160" width="45" height="140" opacity="0.6" />
        </g>
      )
    case 'land':
      return (
        <g>
          <path d="M0 210 Q100 180 200 205 T400 195 V300 H0z" fill={ground} opacity="0.75" />
          <path d="M0 245 Q120 225 230 245 T400 240 V300 H0z" fill={ground} />
          <line x1="60" y1="210" x2="60" y2="250" stroke={light} strokeWidth="3" />
          <line x1="340" y1="196" x2="340" y2="242" stroke={light} strokeWidth="3" />
        </g>
      )
    case 'interior':
      return (
        <g>
          <rect y="220" width="400" height="80" fill={ground} opacity="0.5" />
          <rect x="250" y="60" width="100" height="120" fill={light} stroke={ground} strokeWidth="6" />
          <rect x="60" y="170" width="150" height="50" rx="10" fill={ground} />
          <rect x="60" y="150" width="30" height="40" rx="8" fill={ground} />
          <rect x="180" y="150" width="30" height="40" rx="8" fill={ground} />
        </g>
      )
    case 'person':
      return (
        <g fill={ground}>
          <circle cx="200" cy="120" r="52" />
          <path d="M90 300c0-70 50-110 110-110s110 40 110 110z" />
        </g>
      )
  }
}
