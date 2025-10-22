import express from 'express';
import { createServer, Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import deviceRoutes from './routes/device';

const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"]
  }
});

app.use(cors());
app.use(express.json());

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
app.use('/api/devices', deviceRoutes);

const PORT = process.env.PORT || 3000;

// Export the server instance without starting it
export { app, httpServer, io };

// Only start the server if this file is run directly
if (require.main === module) {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}