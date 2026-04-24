# HR Workflow Designer 

A visual workflow builder for HR processes built with React and React Flow. I made this as part of the Tredence Studio internship case study.

---

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

---

## Architecture Decisions

### Folder Structure

```
src/
├── api/
│   └── mockApi.js          # Mock REST endpoints (/api/automations, /api/simulate)
├── components/
│   ├── modals/
│   │   ├── ExportModal.jsx  # JSON export with copy + download
│   │   ├── ImportModal.jsx  # JSON import with validation
│   │   └── Modal.module.css
│   ├── nodes/
│   │   ├── FlowNode.jsx     # Generic node renderer + per-type exports
│   │   └── FlowNode.module.css
│   ├── panels/
│   │   ├── NodeForm.jsx     # Type-aware property editor
│   │   ├── RightPanel.jsx   # Edit / Simulate / Validate tabs
│   │   ├── SimulationPanel.jsx
│   │   ├── ValidationPanel.jsx
│   │   └── WorkflowCanvas.jsx
│   ├── shared/
│   │   ├── KVEditor.jsx     # Reusable key-value pair editor
│   │   └── Toggle.jsx       # Accessible toggle switch
│   └── sidebar/
│       ├── Sidebar.jsx      # Node palette + templates + actions
│       ├── StatusBar.jsx
│       └── Topbar.jsx
├── hooks/
│   ├── useSimulation.js     # Simulation API call + loading state
│   └── useWorkflow.js       # All workflow state + operations
├── styles/
│   └── global.css           # CSS custom properties + global resets
├── utils/
│   └── nodeConstants.js     # Node metadata, default data, templates
├── App.jsx                  # Root layout (CSS Grid)
└── main.jsx
```

### State Management

All workflow state lives in `useWorkflow.js` (a custom hook). It uses React Flow's `useNodesState` / `useEdgesState` internally and exposes clean action functions (`addNode`, `updateSelectedNode`, `deleteSelected`, etc.) to the component tree. No external state library is needed — React Flow's built-in state + a single custom hook is sufficient for this scope.

### API Mocking

`src/api/mockApi.js` exports a `mockFetch(url, options)` function that mimics `fetch()` with a 300 ms artificial delay. It handles two endpoints:

- `GET /api/automations` — returns the list of available automated actions
- `POST /api/simulate` — runs cycle detection, connectivity checks, and topological traversal, returning a step-by-step execution log

To connect a real backend, replace `mockFetch` calls in `useWorkflow.js` and `useSimulation.js` with native `fetch()`.

### Styling

CSS Modules are used throughout for component-scoped styles. Design tokens (colors, spacing, borders) are defined as CSS custom properties in `global.css` and consumed everywhere via `var(--token)`.

---

## What's Completed

-  Visual drag-and-drop canvas powered by React Flow
-  Five node types: Start, Task, Approval, Automated, End
-  Type-specific property editor (NodeForm) with KV pairs, date pickers, toggles, selects
-  Edge connections with animated flow
-  Mock `/api/automations` — dynamic action list with parameter forms
-  Mock `/api/simulate` — cycle detection, disconnection check, topological execution log
-  Client-side validation panel (no API call required)
-  Export workflow to JSON (copy or download)
-  Import workflow from JSON
-  Two built-in templates (Employee Onboarding, Leave Approval)
-  MiniMap, zoom controls, keyboard delete
-  Status bar showing live node/edge counts and selected node

## What I'd Add With More Time

- **Real backend** — FastAPI or Express implementing the simulate endpoint with persistent storage
- **Drag-from-sidebar** — drop nodes at a specific canvas position via `onDrop` + `reactFlowInstance.screenToFlowPosition()`
- **Conditional edges** — branches based on approval outcome (approved / rejected paths)
- **Undo/redo** — using a history stack or `useUndoable`
- **Authentication** — user sessions with workflow save/load per user
- **AI suggestions** — call an LLM to auto-generate a workflow from a natural-language description
- **Unit tests** — Vitest + React Testing Library for hooks and pure utility functions
- **E2E tests** — Playwright for canvas interactions
