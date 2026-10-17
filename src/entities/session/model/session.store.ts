import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { HttpError, ServiceProvider } from '@/shared/api'
import type { AuthService } from '../api/auth.service'
import type { AuthTokens, AuthUser, LoginCredentials } from './types'

const authService = () => ServiceProvider.get<AuthService>('auth')

const STORAGE_KEY = 'session'
const ACCESS_TOKEN_KEY = `${STORAGE_KEY}:access-token`
const REFRESH_TOKEN_KEY = `${STORAGE_KEY}:refresh-token`
const USER_KEY = `${STORAGE_KEY}:user`

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export const useSessionStore = defineStore('session', () => {
  const accessToken = ref<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY))
  const refreshToken = ref<string | null>(localStorage.getItem(REFRESH_TOKEN_KEY))
  const user = ref<AuthUser | null>(readStoredUser())

  const isAuthenticated = computed(() => accessToken.value !== null)

  function setSession(tokens: AuthTokens): void {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  }

  function setUser(authUser: AuthUser): void {
    user.value = authUser
    localStorage.setItem(USER_KEY, JSON.stringify(authUser))
  }

  function clearSession(): void {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    const response = await authService().login(credentials)
    const { accessToken: newAccessToken, refreshToken: newRefreshToken, ...authUser } = response

    setSession({ accessToken: newAccessToken, refreshToken: newRefreshToken })
    setUser(authUser)
  }

  let refreshPromise: Promise<string | null> | null = null

  async function requestNewTokens(currentRefreshToken: string): Promise<string | null> {
    try {
      const tokens = await authService().refresh(currentRefreshToken)
      setSession(tokens)
      return tokens.accessToken
    } catch {
      clearSession()
      return null
    } finally {
      refreshPromise = null
    }
  }

  function refreshAccessToken(): Promise<string | null> {
    if (!refreshToken.value) {
      clearSession()
      return Promise.resolve(null)
    }

    refreshPromise ??= requestNewTokens(refreshToken.value)
    return refreshPromise
  }

  async function fetchCurrentUser(): Promise<void> {
    if (!accessToken.value) {
      return
    }

    try {
      const currentUser = await authService().getCurrentUser()
      setUser(currentUser)
    } catch (e) {
      if (e instanceof HttpError && e.status === 401) {
        clearSession()
      }
    }
  }

  function logout(): void {
    clearSession()
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    setSession,
    clearSession,
    login,
    refreshAccessToken,
    fetchCurrentUser,
    logout,
  }
})
