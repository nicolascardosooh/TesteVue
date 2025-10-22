"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const device_1 = __importDefault(require("./routes/device"));
function createApp() {
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PATCH"]
        }
    });
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
    return { app, httpServer, io };
}
//# sourceMappingURL=app.js.map