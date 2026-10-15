import type { NextConfig } from 'next'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config: NextConfig = {
  /**
   * The parent directory, not this one. `@makleri/selection` is a `link:` into
   * ../platform, and Turbopack refuses to resolve a symlink whose target sits
   * outside its root — which is exactly how the CMS broke when it took the
   * same dependency with `root` set to itself.
   */
  turbopack: { root: path.resolve(dirname, '..') },
  outputFileTracingRoot: path.resolve(dirname, '..'),
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default config
