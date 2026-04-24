import React, { useMemo } from 'react'
import styles from './ValidationPanel.module.css'

// ── ValidationPanel ───────────────────────────────────────────────────────────
// Performs client-side validation of the workflow graph and renders issues.
export function ValidationPanel({ nodes, edges }) {
  const issues = useMemo(() => {
    const result = []

    const starts = nodes.filter(n => n.type === 'startNode')
    const ends   = nodes.filter(n => n.type === 'endNode')

    if (starts.length === 0) result.push({ sev: 'error', msg: 'No Start Node found' })
    if (starts.length > 1)  result.push({ sev: 'error', msg: 'Multiple Start Nodes detected' })
    if (ends.length === 0)  result.push({ sev: 'error', msg: 'No End Node found' })

    // Disconnected nodes
    const connected = new Set()
    edges.forEach(e => { connected.add(e.source); connected.add(e.target) })
    nodes.forEach(n => {
      if (!connected.has(n.id) && n.type !== 'startNode') {
        result.push({ sev: 'warn', msg: `"${n.data.title || n.type}" is disconnected` })
      }
    })

    // Missing titles on task nodes
    nodes.filter(n => n.type === 'taskNode' && !n.data.title).forEach(n => {
      result.push({ sev: 'warn', msg: `Task node (${n.id}) is missing a title` })
    })

    // Automated nodes with no action selected
    nodes.filter(n => n.type === 'automatedNode' && !n.data.actionId).forEach(n => {
      result.push({ sev: 'warn', msg: `"${n.data.title || 'Automated'}" has no action selected` })
    })

    return result
  }, [nodes, edges])

  if (issues.length === 0) {
    return (
      <div className={styles.pass}>
        <div className={styles.passIcon}>✓</div>
        <div className={styles.passText}>No issues found</div>
        <div className={styles.passSub}>Workflow looks valid</div>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {issues.map((iss, i) => (
        <div key={i} className={`${styles.item} ${iss.sev === 'error' ? styles.itemError : styles.itemWarn}`}>
          <span className={styles.icon}>{iss.sev === 'error' ? '✗' : '⚠'}</span>
          <span>{iss.msg}</span>
        </div>
      ))}
    </div>
  )
}
