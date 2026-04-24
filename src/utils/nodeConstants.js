// ── Node type definitions ─────────────────────────────────────────────────────
// Single source of truth for all node type metadata, colors, and default data.

export const NODE_META = {
  startNode: {
    label: 'Start',
    color: '#22c55e',
    bgClass: 'node-start',
    icon: '▶',
    description: 'Entry point of the workflow',
  },
  taskNode: {
    label: 'Task',
    color: '#4f8ef7',
    bgClass: 'node-task',
    icon: '☑',
    description: 'Manual task assigned to a person or role',
  },
  approvalNode: {
    label: 'Approval',
    color: '#a78bfa',
    bgClass: 'node-approval',
    icon: '✓',
    description: 'Approval gate — manual or auto-approve',
  },
  automatedNode: {
    label: 'Automated',
    color: '#f59e0b',
    bgClass: 'node-automated',
    icon: '⚡',
    description: 'Automated action (email, HRIS update, etc.)',
  },
  endNode: {
    label: 'End',
    color: '#ef4444',
    bgClass: 'node-end',
    icon: '■',
    description: 'Terminal node — workflow complete',
  },
}

// Default data shape per node type
export const getDefaultNodeData = (type) => {
  const base = { title: `New ${NODE_META[type]?.label || type}` }
  switch (type) {
    case 'startNode':     return { ...base, metadata: [] }
    case 'taskNode':      return { ...base, description: '', assignee: '', dueDate: '', customFields: [] }
    case 'approvalNode':  return { ...base, approverRole: 'Manager', autoApproveThreshold: 0 }
    case 'automatedNode': return { ...base, actionId: '', actionLabel: '', actionParams: {} }
    case 'endNode':       return { ...base, endMessage: '', summaryFlag: false }
    default:              return base
  }
}

// ── Default workflow (Employee Onboarding) ────────────────────────────────────
export const DEFAULT_NODES = [
  { id: '1', type: 'startNode',     position: { x: 320, y: 60  }, data: { title: 'Employee Onboarding', metadata: [] } },
  { id: '2', type: 'taskNode',      position: { x: 200, y: 180 }, data: { title: 'Collect Documents', assignee: 'HR Admin', dueDate: '2025-08-01', description: 'Gather ID, offer letter, bank details', customFields: [] } },
  { id: '3', type: 'approvalNode',  position: { x: 440, y: 180 }, data: { title: 'Manager Approval', approverRole: 'Manager', autoApproveThreshold: 0 } },
  { id: '4', type: 'automatedNode', position: { x: 310, y: 310 }, data: { title: 'Send Welcome Email', actionId: 'send_email', actionLabel: 'Send Email', actionParams: { to: 'employee@company.com', subject: 'Welcome aboard!', body: '' } } },
  { id: '5', type: 'endNode',       position: { x: 320, y: 430 }, data: { title: 'Onboarding Complete', endMessage: 'Welcome to the team!', summaryFlag: true } },
]

export const DEFAULT_EDGES = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5', animated: true },
]

// ── Leave Approval template ───────────────────────────────────────────────────
export const LEAVE_APPROVAL_NODES = [
  { id: 't1', type: 'startNode',     position: { x: 300, y: 60  }, data: { title: 'Leave Request', metadata: [] } },
  { id: 't2', type: 'taskNode',      position: { x: 300, y: 180 }, data: { title: 'Submit Leave Form', assignee: 'Employee', dueDate: '', description: '', customFields: [] } },
  { id: 't3', type: 'approvalNode',  position: { x: 300, y: 300 }, data: { title: 'Manager Approval', approverRole: 'Manager', autoApproveThreshold: 0 } },
  { id: 't4', type: 'automatedNode', position: { x: 300, y: 420 }, data: { title: 'Update Leave Balance', actionId: 'update_hris', actionLabel: 'Update HRIS Record', actionParams: {} } },
  { id: 't5', type: 'endNode',       position: { x: 300, y: 540 }, data: { title: 'Leave Approved', endMessage: 'Leave approved!', summaryFlag: false } },
]

export const LEAVE_APPROVAL_EDGES = [
  { id: 'et1', source: 't1', target: 't2' },
  { id: 'et2', source: 't2', target: 't3' },
  { id: 'et3', source: 't3', target: 't4' },
  { id: 'et4', source: 't4', target: 't5' },
]
