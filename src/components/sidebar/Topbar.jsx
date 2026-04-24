import React from 'react'
import styles from './Topbar.module.css'

// ── Topbar ────────────────────────────────────────────────────────────────────
export function Topbar({ onImport, onExport, onClear }) {
  return (
    <header className={styles.bar}>
      <div className={styles.logo}>
        Tredence <span className={styles.accent}>Studio</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.title}>HR Workflow Designer</div>
      <div className={styles.actions}>
        <button className={styles.btn} onClick={onImport}>↑ Import</button>
        <button className={styles.btn} onClick={onExport}>↓ Export</button>
        <button className={`${styles.btn} ${styles.danger}`} onClick={onClear}>Clear</button>
      </div>
    </header>
  )
}
