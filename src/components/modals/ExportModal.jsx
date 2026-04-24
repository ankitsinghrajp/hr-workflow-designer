import React from 'react'
import styles from './Modal.module.css'

export function ExportModal({ json, onClose }) {
  const download = () => {
    const blob = new Blob([json], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'workflow.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const copy = () => navigator.clipboard.writeText(json).catch(() => {})

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>Export Workflow JSON</h3>
        <pre className={styles.pre}>{json}</pre>
        <div className={styles.footer}>
          <button className={styles.btn} onClick={copy}>Copy</button>
          <button className={`${styles.btn} ${styles.primary}`} onClick={download}>Download .json</button>
          <button className={styles.btn} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
