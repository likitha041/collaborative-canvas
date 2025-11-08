Real-Time Collaborative Canvas
A real-time drawing platform that allows multiple users to sketch together on a shared canvas with live updates, cursor tracking, and synchronized undo/redo features.

Features
- Live brush and eraser drawing
- Adjustable color and stroke size
- Real-time updates across users
- Global undo and redo
- Display of online user count
- Smooth curve rendering
- Responsive canvas layout

 Tech Stack
| Layer | Technology |
|--------|-------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express |
| Realtime | Socket.io |

Folder Structure

client/
─ index.html
─ style.css
─ canvas.js
─ websocket.js
server/
─ server.js
─ rooms.js
─ drawing-state.js
─ package.json

─ ARCHITECTURE.md

Installation & Usage:

```bash
git clone https://github.com/likitha041/collaborative-canvas.git
cd collaborative-canvas
npm install
npm start

Visit http://localhost:3000
 in multiple browser tabs to test collaboration.

Testing:
Open two or more tabs of http://localhost:3000
Draw on one tab — strokes appear instantly on the others
Use Undo/Redo buttons to update the global canvas

Limitations:
No save/persist feature yet
Undo/Redo is global, not per-user
No authentication system

Future Improvements:
Add room-based canvases
Support touch drawing for mobile
Save and restore sessions
Add shape and text tools
