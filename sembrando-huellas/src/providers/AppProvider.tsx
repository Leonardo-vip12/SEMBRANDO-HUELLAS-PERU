import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ConfigContextProvider } from '@/contexts/ConfigContext'
import { LanguageContextProvider } from '@/contexts/LanguageContext'
import { ThemeContextProvider } from '@/contexts/ThemeContext'
import { UIContextProvider } from '@/contexts/UIContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { SearchProvider } from '@/contexts/SearchContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigContextProvider>
        <LanguageContextProvider>
          <ThemeContextProvider>
            <UIContextProvider>
              <NotificationProvider>
                <SearchProvider>
                  {children}
                </SearchProvider>
              </NotificationProvider>
            </UIContextProvider>
          </ThemeContextProvider>
        </LanguageContextProvider>
      </ConfigContextProvider>
    </QueryClientProvider>
  )
}
