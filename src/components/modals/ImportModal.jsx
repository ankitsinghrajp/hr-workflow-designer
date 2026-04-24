import React, { useState } from 'react'
import styles from './Modal.module.css'

export function ImportModal({ onImport, onClose }) {
  const [text, setText] = useState('')
  const [err, setErr] = useState('')

  const handleImport = () => {
    const error = onImport(text)
    if (error) setErr(error)
    else onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>Import Workflow JSON</h3>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={e => { setText(e.target.value); setErr('') }}
          placeholder="Paste workflow JSON here..."
          rows={10}
        />
        {err && <div className={styles.error}>{err}</div>}
        <div className={styles.footer}>
          <button className={`${styles.btn} ${styles.primary}`} onClick={handleImport}>Import</button>
          <button className={styles.btn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
