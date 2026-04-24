import React from 'react'
import { Handle, Position } from 'reactflow'
import { NODE_META } from '../../utils/nodeConstants'
import styles from './FlowNode.module.css'

// ── FlowNode ──────────────────────────────────────────────────────────────────
// Generic node renderer. Receives `type` as a prop and applies styles from
// NODE_META. Handles are conditionally rendered based on node type.
function FlowNode({ data, type, selected }) {
  const meta = NODE_META[type] || NODE_META.taskNode
  const hasSource = type !== 'endNode'
  const hasTarget = type !== 'startNode'

  return (
    <div
      className={`${styles.node} ${styles[type]} ${selected ? styles.selected : ''}`}
      style={{ '--node-color': meta.color }}
    >
      {hasTarget && (
        <Handle type="target" position={Position.Top} className={styles.handle} />
      )}

      <div className={styles.typeLabel}>
        <span className={styles.icon}>{meta.icon}</span>
        {meta.label}
      </div>

      <div className={styles.title}>{data.title || `New ${meta.label}`}</div>

      {data.subtitle && (
        <div className={styles.subtitle}>{data.subtitle}</div>
      )}

      {hasSource && (
        <Handle type="source" position={Position.Bottom} className={styles.handle} />
      )}
    </div>
  )
}

// Export one component per node type so ReactFlow can register them separately
export const StartNode     = (props) => <FlowNode {...props} type="startNode" />
export const TaskNode      = (props) => <FlowNode {...props} type="taskNode" />
export const ApprovalNode  = (props) => <FlowNode {...props} type="approvalNode" />
export const AutomatedNode = (props) => <FlowNode {...props} type="automatedNode" />
export const EndNode       = (props) => <FlowNode {...props} type="endNode" />

// Map consumed by <ReactFlow nodeTypes={} />
export const nodeTypes = {
  startNode:     StartNode,
  taskNode:      TaskNode,
  approvalNode:  ApprovalNode,
  automatedNode: AutomatedNode,
  endNode:       EndNode,
}

export default FlowNode
