import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'
import { site } from '#/lib/site'

export default function Header() {
  return (
    <header className="site-header px-4">
      <nav className="page-wrap">
        <Link
          to="/dev-logs"
          className="site-brand"
          activeProps={{ className: 'site-brand is-active' }}
          activeOptions={{ exact: false }}
        >
          {site.name}
        </Link>

        <div className="nav-links">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
