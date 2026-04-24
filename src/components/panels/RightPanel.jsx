import React, { useState } from 'react'
import { NodeForm } from './NodeForm'
import { SimulationPanel } from './SimulationPanel'
import { ValidationPanel } from './ValidationPanel'
import styles from './RightPanel.module.css'

const TABS = [
  { id: 'edit',     label: 'Edit' },
  { id: 'simulate', label: 'Simulate' },
  { id: 'validate', label: 'Validate' },
]

// ── RightPanel ────────────────────────────────────────────────────────────────
// Hosts the tabbed right sidebar: Edit / Simulate / Validate.
export function RightPanel({ selectedNode, automations, nodes, edges, onNodeChange, forcedTab }) {
  const [activeTab, setActiveTab] = useState('edit')

  // Allow parent to push a tab (e.g. auto-switch to edit on node click)
  const tab = forcedTab || activeTab

  return (
    <aside className={styles.panel}>
      <div className={styles.tabs}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${tab === t.id ? styles.active : ''}`}
            onClick={() => { setActiveTab(t.id) }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.body}>
        {tab === 'edit' && (
          <NodeForm node={selectedNode} automations={automations} onChange={onNodeChange} />
        )}

        {tab === 'simulate' && (
          <>
            <div className={styles.hint}>
              Serializes the graph and posts to <code>/api/simulate</code>
            </div>
            <SimulationPanel nodes={nodes} edges={edges} />
          </>
        )}

        {tab === 'validate' && (
          <>
            <div className={styles.hint}>
              {nodes.length} nodes · {edges.length} edges
            </div>
            <ValidationPanel nodes={nodes} edges={edges} />
          </>
        )}
      </div>
    </aside>
  )
}
