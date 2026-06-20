import { useEffect } from 'react'
import AppRoutes from './routes'
import { useThemeStore } from './store'

export default function App() {
  const { theme } = useThemeStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return <AppRoutes />
}
