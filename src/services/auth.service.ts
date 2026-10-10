import { http } from '@/api/http-client'
import type { AuthTokens, AuthUser, LoginCredentials, LoginResponse } from '@/types/auth'

const TOKEN_LIFETIME_MINUTES = 30

export class AuthService {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...credentials, expiresInMins: TOKEN_LIFETIME_MINUTES }),
    })
  }

  getCurrentUser(accessToken: string): Promise<AuthUser> {
    return http<AuthUser>('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  }

  refresh(refreshToken: string): Promise<AuthTokens> {
    return http<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken, expiresInMins: TOKEN_LIFETIME_MINUTES }),
    })
  }
}
