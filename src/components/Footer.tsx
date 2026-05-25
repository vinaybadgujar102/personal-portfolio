import { site } from '#/lib/site'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer px-4">
      <div className="page-wrap">
        <p className="m-0">
          &copy; {year} {site.name}
        </p>
      </div>
    </footer>
  )
}
