import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface UIContextValue {
  sidebarOpen: boolean
  mobileMenuOpen: boolean
  toggleSidebar: () => void
  toggleMobileMenu: () => void
  closeAll: () => void
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIContextProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), [])
  const toggleMobileMenu = useCallback(() => setMobileMenuOpen((prev) => !prev), [])
  const closeAll = useCallback(() => {
    setSidebarOpen(false)
    setMobileMenuOpen(false)
  }, [])

  return (
    <UIContext.Provider value={{ sidebarOpen, mobileMenuOpen, toggleSidebar, toggleMobileMenu, closeAll }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIContextProvider')
  return ctx
}
