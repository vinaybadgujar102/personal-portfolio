import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, relative, resolve, basename } from 'node:path'
import fg from 'fast-glob'
import matter from 'gray-matter'
import {
  loadContentSources,
  toSlug,
  toGroup,
  headingToId,
} from './lib/paths.ts'

const ROOT = resolve(import.meta.dirname, '..')
const sources = loadContentSources(ROOT)
const syncedDir = resolve(ROOT, 'content/synced')
const generatedDir = resolve(ROOT, 'src/generated')

type TocEntry = { id: string; label: string }
type NoteEntry = {
  slug: string
  title: string
  group: string
  section: string
  vaultPath: string
  markdown: string
  toc: TocEntry[]
  updatedAt: string
  featured?: boolean
}

type Manifest = { notes: NoteEntry[] }

const embedRegex = /!\[\[([^\]]+)\]\]/g
const wikiRegex = /\[\[([^\|\]]+)(?:\|([^\]]+))?\]\]/g
const dateHeadingRegex = /^###\s+(.+)$/gm

function loadAssetMap(): Record<string, string> {
  const p = resolve(ROOT, 'content/asset-map.json')
  if (!existsSync(p)) return {}
  return JSON.parse(readFileSync(p, 'utf-8')) as Record<string, string>
}

function buildTitle(vaultRelative: string, frontmatterTitle?: string): string {
  if (frontmatterTitle) return String(frontmatterTitle)
  return basename(vaultRelative, '.md')
}

function buildSlugMap(notes: { vaultPath: string; slug: string; title: string }[]) {
  const byName = new Map<string, string>()
  for (const n of notes) {
    const name = basename(n.vaultPath, '.md').toLowerCase()
    byName.set(name, n.slug)
  }
  return byName
}

function transformMarkdown(
  raw: string,
  vaultRelative: string,
  assetMap: Record<string, string>,
  slugByNoteName: Map<string, string>,
): { markdown: string; toc: TocEntry[] } {
  const toc: TocEntry[] = []

  let body = raw.replace(dateHeadingRegex, (_, label: string) => {
    const trimmed = label.trim()
    const id = headingToId(trimmed)
    toc.push({ id, label: trimmed })
    return `### ${trimmed}`
  })

  body = body.replace(embedRegex, (_, embedName: string) => {
    const key = `${vaultRelative}::${embedName.trim()}`
    const url = assetMap[key]
    if (!url) return `*[Missing image: ${embedName}]*`
    return `![](${url})`
  })

  body = body.replace(wikiRegex, (_, target: string, alias?: string) => {
    const noteName = target.trim()
    const slug = slugByNoteName.get(noteName.toLowerCase())
    const label = alias?.trim() || noteName
    if (slug) return `[${label}](/dev-logs/${slug})`
    return label
  })

  return { markdown: body, toc }
}

function main() {
  const manifestPath = resolve(generatedDir, 'dev-logs-manifest.json')

  if (!existsSync(syncedDir)) {
    if (existsSync(manifestPath)) {
      console.warn('No synced content — keeping existing dev-logs-manifest.json')
      return
    }
    console.error('Run sync first: npm run content')
    process.exit(1)
  }

  const assetMap = loadAssetMap()
  const mdFiles = fg.sync('**/*.md', { cwd: syncedDir, absolute: true }).sort()

  if (mdFiles.length === 0 && existsSync(manifestPath)) {
    console.warn('No markdown in content/synced — keeping existing manifest')
    return
  }

  const draftNotes = mdFiles.map((absPath) => {
    const vaultRelative = relative(syncedDir, absPath)
    const { data, content } = matter(readFileSync(absPath, 'utf-8'))
    return {
      vaultPath: vaultRelative,
      slug: toSlug(vaultRelative),
      title: buildTitle(vaultRelative, data.title as string | undefined),
      group: toGroup(vaultRelative),
      raw: content,
      updatedAt: (data.updated as string) || new Date().toISOString(),
      featured:
        data.featured === true ||
        /dev\s*logs/i.test(basename(vaultRelative, '.md')),
    }
  })

  const slugByNoteName = buildSlugMap(draftNotes)

  const notes: NoteEntry[] = draftNotes.map((d) => {
    const { markdown, toc } = transformMarkdown(
      d.raw,
      d.vaultPath,
      assetMap,
      slugByNoteName,
    )
    return {
      slug: d.slug,
      title: d.title,
      group: d.group,
      section: sources.section,
      vaultPath: d.vaultPath,
      markdown,
      toc,
      updatedAt: d.updatedAt,
      featured: d.featured,
    }
  })

  notes.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return a.title.localeCompare(b.title)
  })

  const manifest: Manifest = { notes }
  mkdirSync(generatedDir, { recursive: true })
  writeFileSync(
    resolve(generatedDir, 'dev-logs-manifest.json'),
    JSON.stringify(manifest, null, 2),
  )
  console.log(`Built manifest with ${notes.length} dev log notes.`)
}

main()
