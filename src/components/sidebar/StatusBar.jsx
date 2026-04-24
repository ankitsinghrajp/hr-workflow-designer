import React from 'react'
import { NODE_META } from '../../utils/nodeConstants'
import styles from './StatusBar.module.css'

export function StatusBar({ nodes, edges, selectedNode }) {
  return (
    <footer className={styles.bar}>
      <span className={styles.stat}>Nodes: <strong>{nodes.length}</strong></span>
      <span className={styles.sep}>·</span>
      <span className={styles.stat}>Edges: <strong>{edges.length}</strong></span>
      <span className={styles.sep}>·</span>
      <span className={selectedNode ? styles.selected : styles.none}>
        {selectedNode
          ? `Selected: ${NODE_META[selectedNode.type]?.label} — ${selectedNode.data.title}`
          : 'No selection'}
      </span>
      <span className={styles.brand}>
        HR Workflow Designer · Tredence Studio
      </span>
    </footer>
  )
}
