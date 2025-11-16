import { useEffect, useState, useCallback } from 'react'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseApiOptions {
  cacheKey?: string
  cacheTTL?: number
}

const cache = new Map<string, { data: any; timestamp: number }>()

/**
 * Generic hook for API calls with loading, error states, and optional caching
 */
export function useApi<T>(
  fetchFn: () => Promise<T>,
  deps: any[] = [],
  options?: UseApiOptions
): ApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const fetch = useCallback(async () => {
    // Check cache if enabled
    if (options?.cacheKey) {
      const cached = cache.get(options.cacheKey)
      if (cached && options.cacheTTL) {
        const age = Date.now() - cached.timestamp
        if (age < options.cacheTTL) {
          setState({ data: cached.data, loading: false, error: null })
          return
        }
      }
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const data = await fetchFn()

      // Store in cache if enabled
      if (options?.cacheKey) {
        cache.set(options.cacheKey, { data, timestamp: Date.now() })
      }

      setState({ data, loading: false, error: null })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setState({ data: null, loading: false, error: message })
    }
  }, [fetchFn, options?.cacheKey, options?.cacheTTL])

  useEffect(() => {
    fetch()
  }, deps)

  return { ...state, refetch: fetch }
}

/**
 * Clear all cached API data
 */
export function clearApiCache() {
  cache.clear()
}

/**
 * Clear specific cache entry
 */
export function clearCacheEntry(key: string) {
  cache.delete(key)
}

