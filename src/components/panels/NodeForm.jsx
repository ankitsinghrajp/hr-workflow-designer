import React from 'react'
import { KVEditor } from '../shared/KVEditor'
import { Toggle } from '../shared/Toggle'
import { NODE_META } from '../../utils/nodeConstants'
import styles from './NodeForm.module.css'

// ── NodeForm ──────────────────────────────────────────────────────────────────
// Renders the appropriate form fields based on the selected node's type.
// Props:
//   node        – selected node object (null = nothing selected)
//   automations – list of available automated actions from API
//   onChange    – (newData) => void
export function NodeForm({ node, automations, onChange }) {
  if (!node) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>⬡</div>
        <p>Select a node to edit its properties</p>
      </div>
    )
  }

  const { type, data } = node
  const meta = NODE_META[type]
  const set = (field, val) => onChange({ ...data, [field]: val })

  return (
    <div className={styles.form}>
      {/* Node header badge */}
      <div className={styles.header} style={{ '--node-color': meta?.color }}>
        <span className={styles.headerIcon}>{meta?.icon}</span>
        <div>
          <div className={styles.headerType}>{meta?.label} Node</div>
          <div className={styles.headerId}>ID: {node.id}</div>
        </div>
      </div>

      {/* ── Start Node ── */}
      {type === 'startNode' && (
        <>
          <Field label="Start Title *">
            <input value={data.title || ''} onChange={e => set('title', e.target.value)} placeholder="e.g. Employee Onboarding" />
          </Field>
          <Field label="Metadata (key-value)">
            <KVEditor pairs={data.metadata || []} onChange={v => set('metadata', v)} />
          </Field>
        </>
      )}

      {/* ── Task Node ── */}
      {type === 'taskNode' && (
        <>
          <Field label="Title *">
            <input value={data.title || ''} onChange={e => set('title', e.target.value)} placeholder="Task name" />
          </Field>
          <Field label="Description">
            <textarea value={data.description || ''} onChange={e => set('description', e.target.value)} placeholder="What needs to be done?" rows={3} />
          </Field>
          <Field label="Assignee">
            <input value={data.assignee || ''} onChange={e => set('assignee', e.target.value)} placeholder="Name or role" />
          </Field>
          <Field label="Due Date">
            <input type="date" value={data.dueDate || ''} onChange={e => set('dueDate', e.target.value)} />
          </Field>
          <Field label="Custom Fields">
            <KVEditor pairs={data.customFields || []} onChange={v => set('customFields', v)} />
          </Field>
        </>
      )}

      {/* ── Approval Node ── */}
      {type === 'approvalNode' && (
        <>
          <Field label="Title *">
            <input value={data.title || ''} onChange={e => set('title', e.target.value)} placeholder="Approval step name" />
          </Field>
          <Field label="Approver Role">
            <select value={data.approverRole || 'Manager'} onChange={e => set('approverRole', e.target.value)}>
              {['Manager', 'HRBP', 'Director', 'VP', 'CEO', 'Department Head'].map(r => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </Field>
          <Field label="Auto-approve Threshold (0 = manual)">
            <input
              type="number" min="0"
              value={data.autoApproveThreshold ?? 0}
              onChange={e => set('autoApproveThreshold', Number(e.target.value))}
            />
          </Field>
        </>
      )}

      {/* ── Automated Node ── */}
      {type === 'automatedNode' && (
        <>
          <Field label="Title *">
            <input value={data.title || ''} onChange={e => set('title', e.target.value)} placeholder="Step name" />
          </Field>
          <Field label="Action">
            <select
              value={data.actionId || ''}
              onChange={e => {
                const action = automations.find(a => a.id === e.target.value)
                const params = {}
                if (action) action.params.forEach(p => (params[p] = data.actionParams?.[p] || ''))
                set('actionId', e.target.value)
                set('actionLabel', action?.label || '')
                set('actionParams', params)
                onChange({ ...data, actionId: e.target.value, actionLabel: action?.label || '', actionParams: params })
              }}
            >
              <option value="">-- Select action --</option>
              {automations.map(a => (
                <option key={a.id} value={a.id}>{a.label}</option>
              ))}
            </select>
          </Field>
          {data.actionId && automations.find(a => a.id === data.actionId)?.params.map(p => (
            <Field key={p} label={p.replace(/_/g, ' ')}>
              <input
                value={data.actionParams?.[p] || ''}
                onChange={e => set('actionParams', { ...data.actionParams, [p]: e.target.value })}
                placeholder={`Enter ${p}`}
              />
            </Field>
          ))}
        </>
      )}

      {/* ── End Node ── */}
      {type === 'endNode' && (
        <>
          <Field label="End Message">
            <input value={data.endMessage || ''} onChange={e => set('endMessage', e.target.value)} placeholder="Workflow complete!" />
          </Field>
          <Field label="Generate Summary">
            <Toggle
              checked={!!data.summaryFlag}
              onChange={v => set('summaryFlag', v)}
              label={data.summaryFlag ? 'Enabled' : 'Disabled'}
            />
          </Field>
        </>
      )}
    </div>
  )
}

// ── Local Field wrapper ───────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      {children}
    </div>
  )
}
