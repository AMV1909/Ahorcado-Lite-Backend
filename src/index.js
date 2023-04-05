import { Server } from "socket.io";
import { createServer } from "http";

import { app } from "./app.js";
import { gameSocket } from "./sockets/game.socket.js";

import "./database/db.js";

// Create the server
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Sockets
gameSocket(io);

// Start the server
server.listen(app.get("port"), () => {
    console.log(`Server on port ${app.get("port")}`);
});
