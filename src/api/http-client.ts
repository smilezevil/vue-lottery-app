const BASE_URL = import.meta.env.VITE_API_URL

export interface RequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>
}

export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
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

export async function http<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new HttpError(response.status, await readErrorMessage(response))
  }

  return response.json() as Promise<T>
}
