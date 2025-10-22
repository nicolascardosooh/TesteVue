"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.httpServer = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const device_1 = __importDefault(require("./routes/device"));
const app = (0, express_1.default)();
exports.app = app;
const httpServer = (0, http_1.createServer)(app);
exports.httpServer = httpServer;
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH"]
    }
});
exports.io = io;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// WebSocket connection
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
// Make io available to routes
app.set('io', io);
// Routes
app.use('/api/devices', device_1.default);
const PORT = process.env.PORT || 3000;
// Only start the server if this file is run directly
if (require.main === module) {
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
//# sourceMappingURL=server.js.map