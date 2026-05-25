import { execSync } from 'node:child_process'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, relative, resolve, basename } from 'node:path'
import fg from 'fast-glob'
import {
  githubRepoSlug,
  githubRepoUrl,
  loadContentSources,
} from './lib/paths.ts'

const ROOT = resolve(import.meta.dirname, '..')
const sources = loadContentSources(ROOT)
const github = sources.github

if (!github) {
  console.error('content-sources.json must define a "github" block.')
  process.exit(1)
}

const syncedDir = resolve(ROOT, 'content/synced')
const assetsDir = resolve(ROOT, 'public/assets')
const cacheDir = resolve(ROOT, '.cache/dev_logs')
const statePath = resolve(ROOT, 'content/.github-sync-state.json')
const repoUrl = githubRepoUrl(sources)
const repoSlug = githubRepoSlug(sources)
const branch = github.branch

const embedRegex = /!\[\[([^\]]+)\]\]/g

type SyncState = { sha: string; syncedAt: string }

function readState(): SyncState | null {
  if (!existsSync(statePath)) return null
  return JSON.parse(readFileSync(statePath, 'utf-8')) as SyncState
}

function writeState(sha: string) {
  const state: SyncState = { sha, syncedAt: new Date().toISOString() }
  writeFileSync(statePath, JSON.stringify(state, null, 2))
}

function remoteHeadSha(): string {
  const out = execSync(
    `git ls-remote "${repoUrl}" "refs/heads/${branch}"`,
    { encoding: 'utf-8' },
  ).trim()
  const sha = out.split('\t')[0]
  if (!sha) {
    throw new Error(`Could not resolve refs/heads/${branch} for ${repoSlug}`)
  }
  return sha
}

function ensureClone(sha: string) {
  mkdirSync(resolve(ROOT, '.cache'), { recursive: true })
  if (!existsSync(cacheDir)) {
    execSync(`git clone --depth 1 --branch "${branch}" "${repoUrl}" "${cacheDir}"`, {
      stdio: 'inherit',
    })
    return
  }
  execSync('git fetch origin', { cwd: cacheDir, stdio: 'inherit' })
  execSync(`git checkout "${branch}"`, { cwd: cacheDir, stdio: 'inherit' })
  execSync(`git reset --hard "${sha}"`, { cwd: cacheDir, stdio: 'inherit' })
}

function collectMdFiles(repoRoot: string): string[] {
  const files = new Set<string>()
  for (const pattern of sources.include) {
    const matches = fg.sync(pattern, {
      cwd: repoRoot,
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

function findEmbedPath(repoRoot: string, notePath: string, embedName: string): string | null {
  const noteDir = dirname(notePath)
  const candidates = [
    resolve(repoRoot, embedName),
    resolve(noteDir, embedName),
    resolve(repoRoot, 'attachments', embedName),
  ]
  for (const p of candidates) {
    if (existsSync(p)) return p
  }
  return null
}

function assetPublicPath(repoRelative: string, embedName: string): string {
  const safe = `${repoRelative.replace(/\.md$/i, '').replace(/[/\\]/g, '--')}--${embedName}`
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
  return `/assets/${safe}`
}

function syncFromRepo(repoRoot: string) {
  rmSync(syncedDir, { recursive: true, force: true })
  mkdirSync(syncedDir, { recursive: true })
  mkdirSync(assetsDir, { recursive: true })

  const assetMap: Record<string, string> = {}
  const mdFiles = collectMdFiles(repoRoot)

  for (const absPath of mdFiles) {
    const repoRelative = relative(repoRoot, absPath)
    const dest = resolve(syncedDir, repoRelative)
    mkdirSync(dirname(dest), { recursive: true })
    copyFileSync(absPath, dest)

    const content = readFileSync(absPath, 'utf-8')
    let match: RegExpExecArray | null
    embedRegex.lastIndex = 0
    while ((match = embedRegex.exec(content)) !== null) {
      const embedName = match[1]!.trim()
      const src = findEmbedPath(repoRoot, absPath, embedName)
      if (!src) {
        console.warn(`  missing asset: ${embedName} (from ${repoRelative})`)
        continue
      }
      const publicPath = assetPublicPath(repoRelative, embedName)
      const destAsset = resolve(ROOT, 'public', publicPath.slice(1))
      mkdirSync(dirname(destAsset), { recursive: true })
      copyFileSync(src, destAsset)
      assetMap[`${repoRelative}::${embedName}`] = publicPath
    }
  }

  writeFileSync(
    resolve(ROOT, 'content/asset-map.json'),
    JSON.stringify(assetMap, null, 2),
  )
  console.log(`Synced ${mdFiles.length} notes from ${repoSlug}@${branch}.`)
}

function main() {
  const force = process.argv.includes('--force')
  const headSha = remoteHeadSha()
  const state = readState()

  if (
    !force &&
    state?.sha === headSha &&
    existsSync(syncedDir) &&
    existsSync(resolve(ROOT, 'content/asset-map.json'))
  ) {
    console.log(
      `No new commits on ${repoSlug} (${headSha.slice(0, 7)}); using existing synced content.`,
    )
    return
  }

  console.log(
    state?.sha && state.sha !== headSha
      ? `New commit on ${repoSlug}: ${state.sha.slice(0, 7)} → ${headSha.slice(0, 7)}`
      : `Fetching ${repoSlug}@${branch} (${headSha.slice(0, 7)})`,
  )

  ensureClone(headSha)
  syncFromRepo(cacheDir)
  writeState(headSha)
}

main()
