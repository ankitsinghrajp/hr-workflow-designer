import React from 'react'
import { useSimulation } from '../../hooks/useSimulation'
import styles from './SimulationPanel.module.css'

// ── SimulationPanel ───────────────────────────────────────────────────────────
// Calls the mock /api/simulate endpoint and renders the step-by-step log.
export function SimulationPanel({ nodes, edges }) {
  const { result, loading, error, runSimulation } = useSimulation()

  const statusBadge = (status) => {
    const map = { ok: [styles.badgeGreen, 'OK'], warn: [styles.badgeAmber, 'WAIT'], success: [styles.badgeBlue, 'DONE'], error: [styles.badgeRed, 'ERR'] }
    const [cls, text] = map[status] || [styles.badgeGreen, 'OK']
    return <span className={`${styles.badge} ${cls}`}>{text}</span>
  }

  const stepClass = (status) => {
    const map = { ok: styles.ok, warn: styles.warn, success: styles.info, error: styles.err }
    return map[status] || styles.ok
  }

  return (
    <div className={styles.panel}>
      <div className={styles.runRow}>
        <button
          className={styles.runBtn}
          onClick={() => runSimulation(nodes, edges)}
          disabled={loading}
        >
          {loading ? '⏳ Running...' : '▶ Run Simulation'}
        </button>
      </div>

      {error && (
        <div className={styles.errorBox}>{error}</div>
      )}

      {result && (
        <div className={styles.results}>
          <div className={result.success ? styles.passHeader : styles.failHeader}>
            {result.success ? '✓ Simulation passed' : '✗ Simulation failed'}
          </div>

          {result.errors?.length > 0 && (
            <div className={styles.errorList}>
              {result.errors.map((e, i) => (
                <div key={i} className={styles.errorItem}>✗ {e}</div>
              ))}
            </div>
          )}

          <div className={styles.log}>
            {result.steps.length === 0 ? (
              <div className={styles.noSteps}>No steps to display</div>
            ) : (
              result.steps.map(s => (
                <div key={s.step} className={styles.step}>
                  <span className={styles.stepNum}>{s.step}.</span>
                  <span className={stepClass(s.status)}>
                    {s.message}{statusBadge(s.status)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
