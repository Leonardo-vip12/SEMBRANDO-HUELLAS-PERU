import { lazy, Suspense } from 'react'
import { AppProvider } from './providers/AppProvider'
import Loader from './components/ui/Loader'

const AppRoutes = lazy(() => import('./routes/AppRoutes'))

export default function App() {
  return (
    <AppProvider>
      <Suspense fallback={<Loader />}>
        <AppRoutes />
      </Suspense>
    </AppProvider>
  )
}

