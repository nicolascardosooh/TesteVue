import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import deviceRoutes from './routes/device';

export function createApp() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
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

  return { app, httpServer, io };
}