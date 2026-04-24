// ── Mock API ──────────────────────────────────────────────────────────────────
// Simulates async REST endpoints with artificial latency.
// In production, replace mockFetch() with real fetch() calls.

export const MOCK_AUTOMATIONS = [
  { id: 'send_email',    label: 'Send Email',          params: ['to', 'subject', 'body'] },
  { id: 'generate_doc',  label: 'Generate Document',   params: ['template', 'recipient'] },
  { id: 'notify_slack',  label: 'Notify Slack',        params: ['channel', 'message'] },
  { id: 'create_jira',   label: 'Create Jira Ticket',  params: ['project', 'summary', 'priority'] },
  { id: 'send_sms',      label: 'Send SMS',            params: ['phone', 'message'] },
  { id: 'update_hris',   label: 'Update HRIS Record',  params: ['employee_id', 'field', 'value'] },
]

function simulateWorkflow({ nodes, edges }) {
  const steps = []
  const errors = []

  if (!nodes || nodes.length === 0)
    return { success: false, steps: [], errors: ['Workflow is empty'] }

  const startNodes = nodes.filter(n => n.type === 'startNode')
  const endNodes   = nodes.filter(n => n.type === 'endNode')

  if (startNodes.length === 0) errors.push('Missing Start Node')
  if (startNodes.length > 1)  errors.push('Multiple Start Nodes detected')
  if (endNodes.length === 0)  errors.push('Missing End Node')

  // Disconnected node check
  const connectedIds = new Set()
  edges.forEach(e => { connectedIds.add(e.source); connectedIds.add(e.target) })
  const disconnected = nodes.filter(
    n => n.type !== 'startNode' && n.type !== 'endNode' && !connectedIds.has(n.id)
  )
  if (disconnected.length > 0)
    errors.push(`Disconnected nodes: ${disconnected.map(n => n.data.title || n.type).join(', ')}`)

  // Cycle detection via DFS
  const adj = {}
  nodes.forEach(n => (adj[n.id] = []))
  edges.forEach(e => { if (adj[e.source]) adj[e.source].push(e.target) })
  const visited = new Set(), recStack = new Set()
  let hasCycle = false
  function dfs(v) {
    visited.add(v); recStack.add(v)
    for (const u of (adj[v] || [])) {
      if (!visited.has(u)) { if (dfs(u)) return true }
      else if (recStack.has(u)) { hasCycle = true; return true }
    }
    recStack.delete(v)
    return false
  }
  nodes.forEach(n => { if (!visited.has(n.id)) dfs(n.id) })
  if (hasCycle) errors.push('Cycle detected in workflow')

  if (errors.length > 0) return { success: false, steps, errors }

  // Topological traversal
  const inDeg = {}
  nodes.forEach(n => (inDeg[n.id] = 0))
  edges.forEach(e => (inDeg[e.target] = (inDeg[e.target] || 0) + 1))
  const queue = nodes.filter(n => inDeg[n.id] === 0)
  const visited2 = new Set()
  let stepNum = 1

  while (queue.length > 0) {
    const node = queue.shift()
    if (visited2.has(node.id)) continue
    visited2.add(node.id)

    const d = node.data
    let msg = '', status = 'ok'

    switch (node.type) {
      case 'startNode':
        msg = `Workflow started: "${d.title || 'Untitled'}"`
        break
      case 'taskNode':
        msg = `Task "${d.title}" assigned to ${d.assignee || 'Unassigned'}${d.dueDate ? `, due ${d.dueDate}` : ''}`
        break
      case 'approvalNode':
        if (d.autoApproveThreshold > 0) {
          msg = `Approval "${d.title}" — auto-approved (threshold: ${d.autoApproveThreshold})`
        } else {
          msg = `Awaiting approval from ${d.approverRole || 'Manager'} for "${d.title}"`
          status = 'warn'
        }
        break
      case 'automatedNode':
        msg = `Executing automation: ${d.actionLabel || d.actionId || 'Unknown action'}`
        break
      case 'endNode':
        msg = `Workflow complete${d.endMessage ? `: "${d.endMessage}"` : ''}${d.summaryFlag ? ' [Summary generated]' : ''}`
        status = 'success'
        break
      default:
        msg = `Processing node ${node.id}`
    }

    steps.push({ step: stepNum++, nodeId: node.id, type: node.type, message: msg, status })

    edges
      .filter(e => e.source === node.id)
      .forEach(e => {
        inDeg[e.target]--
        if (inDeg[e.target] === 0) {
          const next = nodes.find(n => n.id === e.target)
          if (next) queue.push(next)
        }
      })
  }

  return { success: true, steps, errors: [] }
}

// Unified mock fetch — swap with real fetch() for production
export async function mockFetch(url, options = {}) {
  await new Promise(r => setTimeout(r, 300)) // simulate network latency

  if (url === '/api/automations') {
    return { ok: true, json: () => Promise.resolve(MOCK_AUTOMATIONS) }
  }

  if (url === '/api/simulate') {
    const body = JSON.parse(options.body)
    return { ok: true, json: () => Promise.resolve(simulateWorkflow(body)) }
  }

  return { ok: false, json: () => Promise.resolve({ error: 'Not found' }) }
}
