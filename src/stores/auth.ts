import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { HttpError } from '@/api/http-client'
import { ServiceProvider } from '@/services/service-provider'
import type { AuthTokens, AuthUser, LoginCredentials } from '@/types/auth'

const ACCESS_TOKEN_KEY = 'lottery-access-token'
const REFRESH_TOKEN_KEY = 'lottery-refresh-token'
const USER_KEY = 'lottery-user'

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY))
  const refreshToken = ref<string | null>(localStorage.getItem(REFRESH_TOKEN_KEY))
  const user = ref<AuthUser | null>(readStoredUser())

  const isAuthenticated = computed(() => Boolean(accessToken.value))

  function setTokens(tokens: AuthTokens): void {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  }

  function setUser(authUser: AuthUser): void {
    user.value = authUser
    localStorage.setItem(USER_KEY, JSON.stringify(authUser))
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    const response = await ServiceProvider.auth.login(credentials)
    const { accessToken: newAccessToken, refreshToken: newRefreshToken, ...authUser } = response

    setTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken })
    setUser(authUser)
  }

  let refreshPromise: Promise<string | null> | null = null

  async function requestNewTokens(currentRefreshToken: string): Promise<string | null> {
    try {
      const tokens = await ServiceProvider.auth.refresh(currentRefreshToken)
      setTokens(tokens)
      return tokens.accessToken
    } catch {
      logout()
      return null
    } finally {
      refreshPromise = null
    }
  }

  function refreshAccessToken(): Promise<string | null> {
    if (!refreshToken.value) {
      logout()
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
      const currentUser = await ServiceProvider.auth.getCurrentUser()
      setUser(currentUser)
    } catch (e) {
      if (e instanceof HttpError && e.status === 401) {
        logout()
      }
    }
  }

  function logout(): void {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    setTokens,
    refreshAccessToken,
    login,
    fetchCurrentUser,
    logout,
  }
})
