const BASE_URL = import.meta.env.VITE_API_URL

export interface RequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>
  auth?: boolean
}

export interface AuthHandler {
  getAccessToken(): string | null
  refreshAccessToken(): Promise<string | null>
}

export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

let authHandler: AuthHandler | null = null

export function setAuthHandler(handler: AuthHandler): void {
  authHandler = handler
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string }
    if (body.message) {
      return body.message
    }
  } catch {
  }

  return `HTTP ${response.status}: ${response.statusText}`
}

function send(
  path: string,
  options: Omit<RequestOptions, 'auth'>,
  accessToken: string | null,
): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  return fetch(`${BASE_URL}${path}`, { ...options, headers })
}

export async function http<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = false, ...requestOptions } = options
  const accessToken = auth ? (authHandler?.getAccessToken() ?? null) : null

  let response = await send(path, requestOptions, accessToken)

  if (auth && response.status === 401 && authHandler) {
    const newAccessToken = await authHandler.refreshAccessToken()

    if (newAccessToken) {
      response = await send(path, requestOptions, newAccessToken)
    }
  }

  if (!response.ok) {
    throw new HttpError(response.status, await readErrorMessage(response))
  }

  return response.json() as Promise<T>
}
