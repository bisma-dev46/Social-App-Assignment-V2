import { NavLink, Outlet } from 'react-router-dom'
import clsx from 'clsx'

const LINKS = [
  { to: '/dashboard/posts', label: 'My Posts' },
  { to: '/dashboard/create', label: 'Create Post' },
  { to: '/dashboard/settings', label: 'Profile Settings' },
]

export default function DashboardLayout() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex flex-col gap-6 md:flex-row">
        <aside className="w-full flex-shrink-0 md:w-48">
          <nav className="flex gap-2 overflow-x-auto md:flex-col md:gap-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  clsx(
                    'whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
