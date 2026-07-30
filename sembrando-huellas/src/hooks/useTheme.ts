import { useTheme as useThemeContext } from '@/contexts/ThemeContext'
import { useMediaQuery } from './useMediaQuery'

export function useTheme() {
  const ctx = useThemeContext()
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  const resolvedDark = ctx.theme === 'dark' || (ctx.theme === 'system' && prefersDark)

  return {
    ...ctx,
    isDark: resolvedDark,
    isLight: !resolvedDark,
  }
}
