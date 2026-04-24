import React from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from 'reactflow'
import { nodeTypes } from '../nodes/FlowNode'
import { NODE_META } from '../../utils/nodeConstants'
import styles from './WorkflowCanvas.module.css'

// ── WorkflowCanvas ────────────────────────────────────────────────────────────
// Wraps <ReactFlow> with project-specific defaults and styling.
export function WorkflowCanvas({
  nodes, edges,
  onNodesChange, onEdgesChange,
  onConnect, onNodeClick, onPaneClick,
}) {
  return (
    <div className={styles.canvas}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode="Delete"
        style={{ background: '#0b0d14' }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1}
          color="#1d2438"
        />
        <Controls />
        <MiniMap
          nodeColor={n => NODE_META[n.type]?.color || '#555'}
          style={{ background: '#10131e' }}
        />
      </ReactFlow>
    </div>
  )
}
