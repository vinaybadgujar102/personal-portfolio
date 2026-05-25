import { readFileSync } from 'node:fs'
import { resolve, basename } from 'node:path'

export type ContentSources = {
  source?: 'github' | 'vault'
  vaultPath?: string
  github?: {
    owner: string
    repo: string
    branch: string
  }
  section: string
  include: string[]
  exclude: string[]
}

export function githubRepoUrl(sources: ContentSources): string {
  const g = sources.github!
  return `https://github.com/${g.owner}/${g.repo}.git`
}

export function githubRepoSlug(sources: ContentSources): string {
  const g = sources.github!
  return `${g.owner}/${g.repo}`
}

export function loadContentSources(root: string): ContentSources {
  const raw = readFileSync(resolve(root, 'content-sources.json'), 'utf-8')
  return JSON.parse(raw) as ContentSources
}

export function toSlug(vaultRelativePath: string): string {
  const base = vaultRelativePath.replace(/\.md$/i, '')
  const parts = base.split('/')
  const segment =
    parts.length >= 2 ? parts.slice(-2).join('-') : basename(base)
  return segment
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function toGroup(vaultRelativePath: string): string {
  const parts = vaultRelativePath.replace(/\.md$/i, '').split('/')
  if (parts.length >= 2) return parts[parts.length - 2]!
  return parts[0] ?? 'Notes'
}

export function headingToId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
