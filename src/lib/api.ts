export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)

  if (!res.ok) {
    let body: { error?: string; details?: unknown } | undefined
    try {
      body = await res.json()
    } catch {
      // ignore parse errors
    }
    throw new ApiError(
      body?.error || `Lỗi HTTP ${res.status}`,
      res.status,
      body?.details,
    )
  }

  return res.json() as Promise<T>
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return 'Đã xảy ra lỗi không xác định'
}
