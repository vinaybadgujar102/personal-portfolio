import { execSync } from 'node:child_process'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import fg from 'fast-glob'
import { githubRepoSlug, loadContentSources } from './lib/paths.ts'

const ROOT = resolve(import.meta.dirname, '..')
const sources = loadContentSources(ROOT)
const github = sources.github

if (!github) {
  console.error('content-sources.json must define a "github" block.')
  process.exit(1)
}

const syncedDir = resolve(ROOT, 'content/synced')
const assetsDir = resolve(ROOT, 'public/assets')
const archiveDir = resolve(ROOT, '.cache/dev_logs-archive')
const statePath = resolve(ROOT, 'content/.github-sync-state.json')
const manifestPath = resolve(ROOT, 'src/generated/dev-logs-manifest.json')
const repoSlug = githubRepoSlug(sources)
const { owner, repo, branch } = github

const embedRegex = /!\[\[([^\]]+)\]\]/g
const GITHUB_API = 'https://api.github.com'
const USER_AGENT = 'personal-portfolio-content-sync'

type SyncState = { sha: string; syncedAt: string }

function readState(): SyncState | null {
  if (!existsSync(statePath)) return null
  return JSON.parse(readFileSync(statePath, 'utf-8')) as SyncState
}

function writeState(sha: string) {
  mkdirSync(dirname(statePath), { recursive: true })
  const state: SyncState = { sha, syncedAt: new Date().toISOString() }
  writeFileSync(statePath, JSON.stringify(state, null, 2))
}

function authToken(): string | undefined {
  return process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': USER_AGENT,
  }
  const token = authToken()
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

async function githubFetch(path: string): Promise<Response> {
  const headers = authHeaders()

  const res = await fetch(`${GITHUB_API}${path}`, { headers })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GitHub API ${res.status} for ${path}: ${body.slice(0, 200)}`)
  }
  return res
}

async function remoteHeadSha(): Promise<string> {
  const res = await githubFetch(
    `/repos/${owner}/${repo}/commits/${encodeURIComponent(branch)}`,
  )
  const data = (await res.json()) as { sha: string }
  if (!data.sha) {
    throw new Error(`Could not resolve branch ${branch} for ${repoSlug}`)
  }
  return data.sha
}

async function downloadRepoArchive(): Promise<string> {
  rmSync(archiveDir, { recursive: true, force: true })
  mkdirSync(archiveDir, { recursive: true })

  const tarball = resolve(archiveDir, 'repo.tar.gz')
  const token = authToken()
  const archiveUrl = token
    ? `${GITHUB_API}/repos/${owner}/${repo}/tarball/${encodeURIComponent(branch)}`
    : `https://github.com/${owner}/${repo}/archive/refs/heads/${encodeURIComponent(branch)}.tar.gz`
  const res = await fetch(archiveUrl, {
    headers: authHeaders(),
    redirect: 'follow',
  })
  if (!res.ok) {
    throw new Error(`Failed to download ${archiveUrl}: ${res.status}`)
  }

  const buffer = Buffer.from(await res.arrayBuffer())
  writeFileSync(tarball, buffer)
  execSync(`tar -xzf "${tarball}" -C "${archiveDir}"`, { stdio: 'pipe' })

  const extracted = readdirSync(archiveDir).filter((name) => name !== 'repo.tar.gz')
  if (extracted.length !== 1) {
    throw new Error(`Expected one extracted folder in ${archiveDir}`)
  }
  return resolve(archiveDir, extracted[0]!)
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

async function runSync() {
  const force = process.argv.includes('--force')
  const headSha = await remoteHeadSha()
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

  const repoRoot = await downloadRepoArchive()
  syncFromRepo(repoRoot)
  writeState(headSha)
}

async function main() {
  try {
    await runSync()
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (existsSync(manifestPath)) {
      console.warn(`GitHub sync skipped: ${message}`)
      console.warn('Using committed dev-logs-manifest.json and assets.')
      return
    }
    console.error(message)
    process.exit(1)
  }
}

main()
