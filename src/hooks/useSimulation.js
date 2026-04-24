import { useState } from 'react'
import { mockFetch } from '../api/mockApi'

// ── useSimulation ─────────────────────────────────────────────────────────────
// Encapsulates the simulate API call and its loading/result state.
export function useSimulation() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const runSimulation = async (nodes, edges) => {
    setLoading(true)
    setError(null)
    try {
      const res = await mockFetch('/api/simulate', {
        method: 'POST',
        body: JSON.stringify({ nodes, edges }),
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError('Simulation request failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setResult(null); setError(null) }

  return { result, loading, error, runSimulation, reset }
}
