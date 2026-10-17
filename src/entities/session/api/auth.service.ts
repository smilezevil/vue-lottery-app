import { http } from '@/shared/api'
import type { AuthTokens, AuthUser, LoginCredentials, LoginResponse } from '../model/types'

const TOKEN_LIFETIME_MINUTES = 30

export class AuthService {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...credentials, expiresInMins: TOKEN_LIFETIME_MINUTES }),
    })
  }

  getCurrentUser(): Promise<AuthUser> {
    return http<AuthUser>('/auth/me', { auth: true })
  }

  refresh(refreshToken: string): Promise<AuthTokens> {
    return http<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken, expiresInMins: TOKEN_LIFETIME_MINUTES }),
    })
  }
}
