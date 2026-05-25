import { createFileRoute, Link } from '@tanstack/react-router'
import { devLogsManifest, getDevLogsByGroup } from '#/lib/dev-logs'
import { site } from '#/lib/site'

export const Route = createFileRoute('/dev-logs/')({
  component: DevLogsIndexPage,
  head: () => ({
    meta: [{ title: site.name }],
  }),
})

function DevLogsIndexPage() {
  const byGroup = getDevLogsByGroup()
  const featured = devLogsManifest.notes.find((n) => n.featured)

  return (
    <main className="page-wrap px-4 py-12">
      <p className="page-lead">
        Build notes — progress, fixes, and thoughts.
      </p>

      {featured ? (
        <>
          <p className="m-0 mb-2 text-[var(--fg-muted)]">
            <Link
              to="/dev-logs/$slug"
              params={{ slug: featured.slug }}
              className="font-semibold text-[var(--fg)]"
            >
              {featured.title}
            </Link>
            {featured.toc.length > 0 ? (
              <span className="text-[var(--fg-faint)]">
                {' '}
                — {featured.toc.length} entries
              </span>
            ) : null}
          </p>
          <hr className="rule" />
        </>
      ) : null}

      {[...byGroup.entries()].map(([group, notes]) => (
        <section key={group} className="dev-log-group">
          <h2>{group}</h2>
          <ul className="dev-log-list">
            {notes
              .filter((n) => !n.featured || n.slug !== featured?.slug)
              .map((note) => (
                <li key={note.slug}>
                  <Link
                    to="/dev-logs/$slug"
                    params={{ slug: note.slug }}
                  >
                    {note.title}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </main>
  )
}
