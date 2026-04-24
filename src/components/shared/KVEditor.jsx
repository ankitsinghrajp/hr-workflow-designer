import React from 'react'
import styles from './KVEditor.module.css'

// ── KVEditor ──────────────────────────────────────────────────────────────────
// Renders an editable list of key-value pairs.
// Props:
//   pairs   – Array<{ k: string, v: string }>
//   onChange – (newPairs) => void
export function KVEditor({ pairs = [], onChange }) {
  const add    = () => onChange([...pairs, { k: '', v: '' }])
  const remove = (i) => onChange(pairs.filter((_, j) => j !== i))
  const update = (i, field, val) => {
    const next = [...pairs]
    next[i] = { ...next[i], [field]: val }
    onChange(next)
  }

  return (
    <div className={styles.wrapper}>
      {pairs.map((p, i) => (
        <div key={i} className={styles.row}>
          <input
            className={styles.input}
            placeholder="key"
            value={p.k}
            onChange={e => update(i, 'k', e.target.value)}
          />
          <input
            className={styles.input}
            placeholder="value"
            value={p.v}
            onChange={e => update(i, 'v', e.target.value)}
          />
          <button className={styles.remove} onClick={() => remove(i)}>×</button>
        </div>
      ))}
      <button className={styles.add} onClick={add}>+ Add field</button>
    </div>
  )
}
