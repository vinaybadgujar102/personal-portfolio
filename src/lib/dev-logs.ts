import manifest from '../generated/dev-logs-manifest.json'

export type TocEntry = { id: string; label: string }

export type DevLogNote = {
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

export type DevLogsManifest = {
  notes: DevLogNote[]
}

export const devLogsManifest = manifest as DevLogsManifest

export function getDevLogNote(slug: string): DevLogNote | undefined {
  return devLogsManifest.notes.find((n) => n.slug === slug)
}

export function getDevLogsByGroup(): Map<string, DevLogNote[]> {
  const map = new Map<string, DevLogNote[]>()
  for (const note of devLogsManifest.notes) {
    const list = map.get(note.group) ?? []
    list.push(note)
    map.set(note.group, list)
  }
  return map
}

export function headingToId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
