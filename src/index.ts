import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import userRouter from './routes/user.router';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { MOCK_LOCATIONS } from './data';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('<h2>Health check</h2>');
});

app.use('/api', userRouter);

app.use((_: Request, res: Response) => {
  res.status(404).json('Not found');
});

server.listen(PORT, () => {
  console.log('API is listening on port', PORT);
});

// sockets

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

io.on('connection', socket => {
  console.log(`⚡: ${socket.id} user just connected!`);

  io.emit('map_items', MOCK_LOCATIONS);

  setTimeout(() => {
    io.emit('map_items', MOCK_LOCATIONS.slice(3));
  }, 2000);

  setTimeout(() => {
    io.emit('map_items', MOCK_LOCATIONS.slice(6));
  }, 4000);

  setTimeout(() => {
    io.emit('map_items', MOCK_LOCATIONS);
  }, 6000);

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });
});
