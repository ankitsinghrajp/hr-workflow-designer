import React from 'react'
import styles from './Toggle.module.css'

export function Toggle({ checked, onChange, label }) {
  return (
    <div className={styles.wrap}>
      <label className={styles.toggle}>
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className={styles.slider} />
      </label>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  )
}
