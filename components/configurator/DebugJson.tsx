'use client'

import { useState } from 'react'

/**
 * The exact JSON a submit would send. Only rendered with `?debug` in the URL —
 * for building and demoing, not for realtors.
 */
export function DebugJson({ value }: { value: unknown }) {
  const [copied, setCopied] = useState(false)
  const json = JSON.stringify(value, null, 2)

  async function copy() {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard blocked (non-secure context): the text is selectable anyway.
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'konfigurace.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="mt-10 overflow-hidden rounded-2xl border border-dashed border-ink-soft/40 bg-[#14131a] text-neutral-200">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-4 py-2.5 text-xs">
        <span className="font-semibold text-white">Debug · odesílaný JSON</span>
        <span className="text-neutral-400">viditelné jen s ?debug</span>
        <span className="ml-auto flex gap-2">
          <button type="button" onClick={copy} className="rounded bg-white/10 px-2.5 py-1 hover:bg-white/20">
            {copied ? 'Zkopírováno' : 'Kopírovat'}
          </button>
          <button type="button" onClick={download} className="rounded bg-white/10 px-2.5 py-1 hover:bg-white/20">
            Stáhnout .json
          </button>
        </span>
      </div>
      <pre className="max-h-[32rem] overflow-auto p-4 text-xs leading-relaxed" data-debug-json>
        {json}
      </pre>
    </section>
  )
}
