import React from 'react'
import { NODE_META } from '../../utils/nodeConstants'
import {
  DEFAULT_NODES, DEFAULT_EDGES,
  LEAVE_APPROVAL_NODES, LEAVE_APPROVAL_EDGES,
} from '../../utils/nodeConstants'
import styles from './Sidebar.module.css'

const TEMPLATES = [
  {
    name: 'Employee Onboarding',
    nodes: DEFAULT_NODES,
    edges: DEFAULT_EDGES,
  },
  {
    name: 'Leave Approval',
    nodes: LEAVE_APPROVAL_NODES,
    edges: LEAVE_APPROVAL_EDGES,
  },
]

// ── Sidebar ───────────────────────────────────────────────────────────────────
// Left sidebar: node-type palette, workflow templates, quick actions.
export function Sidebar({ onAddNode, onLoadTemplate, onDeleteSelected, selectedNode }) {
  return (
    <aside className={styles.sidebar}>
      {/* Node palette */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Node Types</h3>
        {Object.entries(NODE_META).map(([type, meta]) => (
          <div
            key={type}
            className={styles.nodeItem}
            onClick={() => onAddNode(type)}
            draggable
            onDragStart={e => e.dataTransfer.setData('nodeType', type)}
            title={meta.description}
          >
            <span className={styles.dot} style={{ background: meta.color }} />
            <span>{meta.label} Node</span>
          </div>
        ))}
      </section>

      {/* Templates */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Templates</h3>
        {TEMPLATES.map(t => (
          <div
            key={t.name}
            className={styles.nodeItem}
            onClick={() => onLoadTemplate(t.nodes, t.edges)}
          >
            <span className={styles.dot} style={{ background: 'var(--text3)' }} />
            <span>{t.name}</span>
          </div>
        ))}
      </section>

      {/* Actions */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Actions</h3>
        {selectedNode && (
          <button className={styles.deleteBtn} onClick={onDeleteSelected}>
            ✕ Delete Selected
          </button>
        )}
        <ul className={styles.tips}>
          <li>Click node type to add</li>
          <li>Drag handles to connect nodes</li>
          <li>Click a node to edit it</li>
          <li>Delete / Backspace to remove</li>
        </ul>
      </section>
    </aside>
  )
}
