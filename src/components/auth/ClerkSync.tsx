import { useEffect } from 'react'
import { useUser } from '@clerk/react'
import { useAuthStore } from '../../store'

export default function ClerkSync() {
  const { isSignedIn, isLoaded, user } = useUser()
  const { login, logout } = useAuthStore()

  useEffect(() => {
    if (!isLoaded) return
    if (isSignedIn && user) {
      login({
        id: user.id,
        name: user.fullName || user.firstName || 'User',
        email: user.primaryEmailAddress?.emailAddress || '',
        avatar: user.imageUrl || '',
      })
    } else {
      logout()
    }
  }, [isSignedIn, isLoaded, user, login, logout])

  return null
}
