const socket = io("https://collaborative-canvas.onrender.com");

function connectRoom(room = "main") {
  socket.emit("join", { room });
}

function pushAction(data) {
  socket.emit("action", data);
}

function askState() {
  socket.emit("get_state");
}

socket.on("connect", () => {
  console.log("✅ Connected to live server");
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Disconnected from server:", reason);
});

export { socket, connectRoom, pushAction, askState };
