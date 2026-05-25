import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

function getPrerenderPages(): Array<{ path: string }> {
  const manifestPath = resolve('src/generated/dev-logs-manifest.json')
  if (!existsSync(manifestPath)) {
    return [{ path: '/dev-logs' }]
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as {
    notes: Array<{ slug: string }>
  }
  return [
    { path: '/' },
    { path: '/dev-logs' },
    ...manifest.notes.map((note) => ({ path: `/dev-logs/${note.slug}` })),
  ]
}

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart({
      static: true,
      prerender: {
        enabled: true,
        crawlLinks: true,
        pages: getPrerenderPages(),
      },
    }),
    viteReact(),
  ],
})

export default config
