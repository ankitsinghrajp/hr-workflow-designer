import { useCallback, useRef, useState, useEffect } from 'react'
import { useNodesState, useEdgesState, addEdge } from 'reactflow'
import { DEFAULT_NODES, DEFAULT_EDGES, getDefaultNodeData, NODE_META } from '../utils/nodeConstants'
import { mockFetch } from '../api/mockApi'

// ── useWorkflow ───────────────────────────────────────────────────────────────
// Centralises all workflow state and operations.
// Components interact through this hook instead of managing state themselves.
export function useWorkflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(DEFAULT_NODES)
  const [edges, setEdges, onEdgesChange] = useEdgesState(DEFAULT_EDGES)
  const [selectedNode, setSelectedNode] = useState(null)
  const [automations, setAutomations] = useState([])
  const nodeId = useRef(100)

  // Fetch automation list once on mount
  useEffect(() => {
    mockFetch('/api/automations')
      .then(r => r.json())
      .then(setAutomations)
  }, [])

  // ── Edge connection
  const onConnect = useCallback((params) => {
    setEdges(eds => addEdge({ ...params, animated: false }, eds))
  }, [setEdges])

  // ── Node selection
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => setSelectedNode(null), [])

  // ── Add node (from sidebar)
  const addNode = useCallback((type) => {
    const id = String(++nodeId.current)
    const newNode = {
      id,
      type,
      position: { x: 250 + Math.random() * 120, y: 150 + Math.random() * 200 },
      data: getDefaultNodeData(type),
    }
    setNodes(nds => [...nds, newNode])
    setSelectedNode(newNode)
    return newNode
  }, [setNodes])

  // ── Update selected node's data
  const updateSelectedNode = useCallback((newData) => {
    if (!selectedNode) return

    // Derive a subtitle string for the node card
    let subtitle = ''
    if (selectedNode.type === 'taskNode')      subtitle = newData.assignee   || ''
    if (selectedNode.type === 'approvalNode')  subtitle = newData.approverRole || ''
    if (selectedNode.type === 'automatedNode') subtitle = newData.actionLabel  || ''
    if (selectedNode.type === 'endNode')       subtitle = newData.endMessage   || ''

    const updated = { ...newData, subtitle }
    setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: updated } : n))
    setSelectedNode(prev => ({ ...prev, data: updated }))
  }, [selectedNode, setNodes])

  // ── Delete selected node + its edges
  const deleteSelected = useCallback(() => {
    if (!selectedNode) return
    setNodes(nds => nds.filter(n => n.id !== selectedNode.id))
    setEdges(eds => eds.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id))
    setSelectedNode(null)
  }, [selectedNode, setNodes, setEdges])

  // ── Load a template (replaces current workflow)
  const loadTemplate = useCallback((templateNodes, templateEdges) => {
    setNodes(templateNodes)
    setEdges(templateEdges)
    setSelectedNode(null)
  }, [setNodes, setEdges])

  // ── Clear entire workflow
  const clearAll = useCallback(() => {
    setNodes([])
    setEdges([])
    setSelectedNode(null)
  }, [setNodes, setEdges])

  // ── Export workflow as JSON string
  const exportJSON = useCallback(() => {
    return JSON.stringify({ nodes, edges }, null, 2)
  }, [nodes, edges])

  // ── Import workflow from JSON string; returns error string or null
  const importJSON = useCallback((text) => {
    try {
      const data = JSON.parse(text)
      if (data.nodes) setNodes(data.nodes)
      if (data.edges) setEdges(data.edges)
      setSelectedNode(null)
      return null
    } catch {
      return 'Invalid JSON — please check the format.'
    }
  }, [setNodes, setEdges])

  return {
    // State
    nodes, edges, selectedNode, automations,
    // RF handlers
    onNodesChange, onEdgesChange, onConnect, onNodeClick, onPaneClick,
    // Actions
    addNode, updateSelectedNode, deleteSelected,
    loadTemplate, clearAll, exportJSON, importJSON,
  }
}
