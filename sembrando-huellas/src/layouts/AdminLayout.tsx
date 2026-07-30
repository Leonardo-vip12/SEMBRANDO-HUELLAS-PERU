import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="grid min-h-screen grid-cols-[260px_1fr]">
      <aside className="border-r bg-gray-50 p-4">
        <div className="text-lg font-semibold">Admin</div>
        <nav className="mt-6 space-y-2">
          <div className="h-10 rounded bg-gray-200" />
          <div className="h-10 rounded bg-gray-200" />
          <div className="h-10 rounded bg-gray-200" />
        </nav>
      </aside>
      <div className="flex flex-col">
        <header className="flex h-16 items-center justify-between border-b px-6">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-8 w-8 rounded-full bg-gray-200" />
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}