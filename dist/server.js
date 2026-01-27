"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const next_1 = __importDefault(require("next"));
const dev = process.env.NODE_ENV !== 'production';
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    const server = (0, express_1.default)();
    const httpServer = http_1.default.createServer(server);
    // Initialize Socket.io
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    // Socket.io Logic
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        socket.on('join-room', (roomId, userId) => {
            socket.join(roomId);
            socket.to(roomId).emit('user-connected', userId);
            socket.on('disconnect', () => {
                socket.to(roomId).emit('user-disconnected', userId);
            });
        });
    });
    // Use a Regex literal /.*/ instead of string '*' or '.*'
    server.all(/.*/, (req, res) => {
        return handle(req, res);
    });
    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
        console.log(`> Ready on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
