/**
 * hooks/useFetch.js
 * Generic data-fetching hook with loading / error / refetch.
 */

import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * @param {() => Promise<any>} fetcher  - async function returning data
 * @param {any[]} deps                  - re-run when these change
 */
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      setData(result)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    run()
    return () => abortRef.current?.abort?.()
  }, [run])

  return { data, loading, error, refetch: run }
}
