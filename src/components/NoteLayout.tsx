import { Link } from '@tanstack/react-router'
import type { DevLogNote } from '#/lib/dev-logs'
import Markdown from './Markdown'

type NoteLayoutProps = {
  note: DevLogNote
}

export default function NoteLayout({ note }: NoteLayoutProps) {
  return (
    <main className="page-wide px-4 py-12">
      <div className="mb-8 text-sm text-[var(--fg-faint)]">
        <Link to="/dev-logs" className="text-[var(--fg-muted)]">
          Dev Logs
        </Link>
        <span className="mx-2">/</span>
        <span>{note.title}</span>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        {note.toc.length > 0 ? (
          <aside className="note-toc lg:sticky lg:top-20 lg:w-40 lg:shrink-0">
            <p className="m-0 font-medium uppercase tracking-wide">On this page</p>
            <ul>
              {note.toc.map((entry) => (
                <li key={entry.id}>
                  <a href={`#${entry.id}`}>{entry.label}</a>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}

        <article className="prose-note min-w-0 flex-1 max-w-[42rem]">
          <p className="note-meta">{note.group}</p>
          <h1 className="page-title">{note.title}</h1>
          <Markdown content={note.markdown} />
        </article>
      </div>
    </main>
  )
}
