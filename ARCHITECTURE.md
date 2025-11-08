System Architecture – Real-Time Collaborative Canvas

This document explains how the collaborative drawing system works, including data flow, WebSocket protocol, undo/redo logic, and synchronization.

Data Flow Diagram:
Client A ──"draw events"──▶ Node Server (Socket.io)
Client B ◀─"broadcast updates"── Node Server (Socket.io)
Each client sends drawing actions to the Node.js server.  
The server rebroadcasts updates to all connected clients, keeping every canvas synchronized.


WebSocket Protocol:

| Event | Direction | Example Payload | Description |
|--------|------------|-----------------|--------------|
| `join` | Client → Server | `{ room: "main" }` | Connects user to main room |
| `action` | Client ↔ Server | `{ type: "draw", payload: {...} }` | Draw, erase, undo, redo |
| `get_state` | Client → Server | `null` | Request current canvas history |
| `state` | Server → Client | `{ log: [...] }` | Send global canvas state |
| `cursor` | Client ↔ Server | `{ x, y }` | Real-time cursor positions |
| `users` | Server → Client | `{ count }` | Online user count |
| `left` | Server → Client | `{ id }` | User disconnected |

 Undo/Redo Logic:
Every drawing or erase event is stored in a global history stack.
Undo removes the latest operation and moves it to a redo list.
Redo restores it from the redo list back to the history.
Server broadcasts state updates to all users for consistency.

Performance Decisions:
| Optimization | Purpose |
|---------------|----------|
| Curve smoothing | Natural, continuous lines |
| Buffered events | Minimized network traffic |
| Device pixel scaling | Sharp rendering on Retina displays |
| History replay | Efficient full-canvas redraws |
| Centralized state | Prevents drift between clients |

Conflict Resolution:
Server acts as single source of truth.
Actions are timestamped for ordered synchronization.
Concurrent drawings are appended sequentially — no overwrites.
Reconnection triggers `get_state` to restore full canvas.

Scalability & Future Extensions:
Use Redis or MongoDB to persist canvas history.
Create room-based namespaces for separate sessions.
Add delta compression for lower network load.
Integrate authentication and user color identity.

Architecture Summary
| Component | Responsibility |
|------------|----------------|
| Client | Capture user strokes and render canvas |
| WebSocket | Transmit and receive real-time updates |
| Server | Manage global state and users |
| Drawing State | Maintain undo/redo operation stacks |

Architecture Type: Event-driven, real-time collaborative system  
Protocol: WebSocket via Socket.io  
Consistency: Centralized shared state

