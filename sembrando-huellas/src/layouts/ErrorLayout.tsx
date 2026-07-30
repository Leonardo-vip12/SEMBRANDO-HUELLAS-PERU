import { Outlet } from 'react-router-dom'

export default function ErrorLayout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4">
      <Outlet />
    </div>
  )
}