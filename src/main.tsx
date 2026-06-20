import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/react'
import { Toaster } from 'react-hot-toast'
import App from './App'
import ClerkSync from './components/auth/ClerkSync'
import './index.css'

const queryClient = new QueryClient()

function ClerkWrapper({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  return (
    <ClerkProvider
      routerPush={(to: string) => navigate(to)}
      routerReplace={(to: string) => navigate(to, { replace: true })}
    >
      {children}
    </ClerkProvider>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')
createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ClerkWrappedApp />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)

function ClerkWrappedApp() {
  return (
    <ClerkWrapper>
      <ClerkSync />
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            borderRadius: '12px',
          },
        }}
      />
    </ClerkWrapper>
  )
}
