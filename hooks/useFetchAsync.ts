'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseFetchAsyncOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  retry?: number
}

interface UseFetchAsyncResult<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useFetchAsync<T>(
  asyncFn: () => Promise<T>,
  deps?: unknown[],
  options?: UseFetchAsyncOptions<T>
): UseFetchAsyncResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await asyncFn()
      setData(result)
      setRetryCount(0)
      options?.onSuccess?.(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      if (retryCount < (options?.retry ?? 0)) {
        setRetryCount(retryCount + 1)
        setTimeout(() => fetch(), 1000)
      }
      options?.onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [asyncFn, options, retryCount])

  useEffect(() => {
    fetch()
  }, deps ? deps : [fetch])

  return { data, isLoading, error, refetch: fetch }
}
