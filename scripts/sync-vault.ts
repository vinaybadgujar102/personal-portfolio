import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
  rmSync,
} from 'node:fs'
import { dirname, join, relative, resolve, basename } from 'node:path'
import fg from 'fast-glob'
import { loadContentSources } from './lib/paths.ts'

const ROOT = resolve(import.meta.dirname, '..')
const sources = loadContentSources(ROOT)
const vaultPath = sources.vaultPath

if (!vaultPath) {
  console.error(
    'vaultPath is not set in content-sources.json — use sync-github or add vaultPath for local vault sync.',
  )
  process.exit(1)
}
const syncedDir = resolve(ROOT, 'content/synced')
const assetsDir = resolve(ROOT, 'public/assets')

const embedRegex = /!\[\[([^\]]+)\]\]/g

function collectMdFiles(): string[] {
  const files = new Set<string>()
  for (const pattern of sources.include) {
    const matches = fg.sync(pattern, {
      cwd: vaultPath,
      absolute: true,
      onlyFiles: true,
      ignore: sources.exclude,
    })
    for (const f of matches) {
      if (f.endsWith('.md')) files.add(f)
    }
  }
  return [...files].sort()
}

function findEmbedPath(notePath: string, embedName: string): string | null {
  const noteDir = dirname(notePath)
  const candidates = [
    resolve(vaultPath, embedName),
    resolve(noteDir, embedName),
    resolve(vaultPath, 'attachments', embedName),
  ]
  for (const p of candidates) {
    if (existsSync(p)) return p
  }
  return null
}

function assetPublicPath(vaultRelative: string, embedName: string): string {
  const safe = `${vaultRelative.replace(/\.md$/i, '').replace(/[/\\]/g, '--')}--${embedName}`
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
  return `/assets/${safe}`
}

function main() {
  if (!existsSync(vaultPath)) {
    console.warn(
      `Vault not found at ${vaultPath} — skipping sync (using committed manifest/assets).`,
    )
    return
  }

  rmSync(syncedDir, { recursive: true, force: true })
  mkdirSync(syncedDir, { recursive: true })
  mkdirSync(assetsDir, { recursive: true })

  const assetMap: Record<string, string> = {}
  const mdFiles = collectMdFiles()

  for (const absPath of mdFiles) {
    const vaultRelative = relative(vaultPath, absPath)
    const dest = resolve(syncedDir, vaultRelative)
    mkdirSync(dirname(dest), { recursive: true })
    copyFileSync(absPath, dest)

    const content = readFileSync(absPath, 'utf-8')
    let match: RegExpExecArray | null
    embedRegex.lastIndex = 0
    while ((match = embedRegex.exec(content)) !== null) {
      const embedName = match[1]!.trim()
      const src = findEmbedPath(absPath, embedName)
      if (!src) {
        console.warn(`  missing asset: ${embedName} (from ${vaultRelative})`)
        continue
      }
      const publicPath = assetPublicPath(vaultRelative, embedName)
      const destAsset = resolve(ROOT, 'public', publicPath.slice(1))
      mkdirSync(dirname(destAsset), { recursive: true })
      copyFileSync(src, destAsset)
      assetMap[`${vaultRelative}::${embedName}`] = publicPath
    }
  }

  writeFileSync(
    resolve(ROOT, 'content/asset-map.json'),
    JSON.stringify(assetMap, null, 2),
  )
  console.log(`Synced ${mdFiles.length} notes from vault.`)
}

main()
