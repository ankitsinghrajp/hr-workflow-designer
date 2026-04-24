import React, { useState } from 'react'
import { ReactFlowProvider } from 'reactflow'
import { useWorkflow } from './hooks/useWorkflow'
import { Topbar } from './components/sidebar/Topbar'
import { Sidebar } from './components/sidebar/Sidebar'
import { StatusBar } from './components/sidebar/StatusBar'
import { WorkflowCanvas } from './components/panels/WorkflowCanvas'
import { RightPanel } from './components/panels/RightPanel'
import { ExportModal } from './components/modals/ExportModal'
import { ImportModal } from './components/modals/ImportModal'
import styles from './App.module.css'

function WorkflowApp() {
  const [exportOpen, setExportOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)

  const {
    nodes, edges, selectedNode, automations,
    onNodesChange, onEdgesChange, onConnect, onNodeClick, onPaneClick,
    addNode, updateSelectedNode, deleteSelected,
    loadTemplate, clearAll, exportJSON, importJSON,
  } = useWorkflow()

  const handleClear = () => {
    if (window.confirm('Clear the entire workflow?')) clearAll()
  }

  return (
    <div className={styles.app}>
      {/* Top bar */}
      <Topbar
        onImport={() => setImportOpen(true)}
        onExport={() => setExportOpen(true)}
        onClear={handleClear}
      />

      {/* Left sidebar */}
      <Sidebar
        onAddNode={addNode}
        onLoadTemplate={loadTemplate}
        onDeleteSelected={deleteSelected}
        selectedNode={selectedNode}
      />

      {/* Centre canvas */}
      <main className={styles.canvasArea}>
        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
        />
      </main>

      {/* Right panel — Edit / Simulate / Validate */}
      <RightPanel
        selectedNode={selectedNode}
        automations={automations}
        nodes={nodes}
        edges={edges}
        onNodeChange={updateSelectedNode}
      />

      {/* Status bar */}
      <StatusBar nodes={nodes} edges={edges} selectedNode={selectedNode} />

      {/* Modals */}
      {exportOpen && (
        <ExportModal json={exportJSON()} onClose={() => setExportOpen(false)} />
      )}
      {importOpen && (
        <ImportModal onImport={importJSON} onClose={() => setImportOpen(false)} />
      )}
    </div>
  )
}

// ReactFlowProvider must wrap any component using RF hooks
export default function App() {
  return (
    <ReactFlowProvider>
      <WorkflowApp />
    </ReactFlowProvider>
  )
}
