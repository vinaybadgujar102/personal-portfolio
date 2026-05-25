import { createFileRoute, notFound } from '@tanstack/react-router'
import NoteLayout from '#/components/NoteLayout'
import { getDevLogNote } from '#/lib/dev-logs'
import { site } from '#/lib/site'

export const Route = createFileRoute('/dev-logs/$slug')({
  component: DevLogNotePage,
  loader: ({ params }) => {
    const note = getDevLogNote(params.slug)
    if (!note) throw notFound()
    return { note }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.note.title} · Dev Logs · ${site.name}`
          : `Dev Logs · ${site.name}`,
      },
    ],
  }),
})

function DevLogNotePage() {
  const { note } = Route.useLoaderData()
  return <NoteLayout note={note} />
}
