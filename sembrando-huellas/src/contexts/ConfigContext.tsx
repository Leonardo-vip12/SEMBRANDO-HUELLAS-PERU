import { createContext, useContext, type ReactNode } from 'react'
import { siteConfig } from '@/config/site'

interface ConfigContextValue {
  siteConfig: typeof siteConfig
}

const ConfigContext = createContext<ConfigContextValue>({ siteConfig })

export function ConfigContextProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigContext.Provider value={{ siteConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  return useContext(ConfigContext)
}
