import { useEffect, useState } from 'react'

const emptyArray = []

function useJsonArray(url, resourceName) {
  const [attempt, setAttempt] = useState(0)
  const [resource, setResource] = useState({
    url: '',
    attempt: -1,
    data: null,
    error: '',
    loading: true,
  })

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      let data = null
      let error = ''

      try {
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) throw new Error(`Request failed with status ${response.status}.`)

        const result = await response.json()
        if (!Array.isArray(result)) throw new Error('Unexpected data format.')

        data = result
      } catch {
        if (controller.signal.aborted) return
        error = `Unable to load ${resourceName}. Please check your connection and try again.`
      } finally {
        if (!controller.signal.aborted) {
          setResource({ url, attempt, data, error, loading: false })
        }
      }
    }

    load()

    return () => controller.abort()
  }, [attempt, resourceName, url])

  const isCurrentRequest = resource.url === url && resource.attempt === attempt

  return {
    data: isCurrentRequest ? resource.data || emptyArray : emptyArray,
    error: isCurrentRequest ? resource.error : '',
    loading: !isCurrentRequest || resource.loading,
    retry: () => setAttempt((currentAttempt) => currentAttempt + 1),
  }
}

export default useJsonArray
