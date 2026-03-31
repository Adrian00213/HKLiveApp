import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { incidentsRouter } from './routes/incidents.js';
import { dealsRouter } from './routes/deals.js';
import { eventsRouter } from './routes/events.js';
import { discussionsRouter } from './routes/discussions.js';
import { transportRouter } from './routes/transport.js';
import { weatherRouter } from './routes/weather.js';
import { authRouter } from './routes/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/incidents', incidentsRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/discussions', discussionsRouter);
app.use('/api/transport', transportRouter);
app.use('/api/weather', weatherRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join district room for localized updates
  socket.on('join:district', (district: string) => {
    socket.join(`district:${district}`);
    console.log(`Client ${socket.id} joined district:${district}`);
  });

  socket.on('leave:district', (district: string) => {
    socket.leave(`district:${district}`);
  });

  socket.on('subscribe:incident', (incidentId: string) => {
    socket.join(`incident:${incidentId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Broadcast helper for controllers
export const broadcastToDistrict = (district: string, event: string, data: any) => {
  io.to(`district:${district}`).emit(event, data);
};

export const broadcastIncidentUpdate = (incidentId: string, data: any) => {
  io.to(`incident:${incidentId}`).emit('incident:update', data);
};

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`HKLive API Server running on port ${PORT}`);
  console.log(`WebSocket server ready`);
});

export { app, io };
