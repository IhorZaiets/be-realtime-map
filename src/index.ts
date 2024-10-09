import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { userRouter } from './routes';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { MOCK_LOCATIONS } from './data';
import { getRandomNumber } from './helpers';
import { SOCKET_EVENTS } from './types';

dotenv.config();

const MINUTE_IN_MILISECONDS = 60000;

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

  io.emit(SOCKET_EVENTS.MAP_ITEMS, MOCK_LOCATIONS);

  // imitation of moving items
  const newMockLoations = MOCK_LOCATIONS.map(item => ({
    ...item,
    coords: {
      lng: item.coords.lng + getRandomNumber(0.001, 0.005),
      lat: item.coords.lat + getRandomNumber(0.001, 0.005),
    },
  }));

  // imitation of moving items
  const timeout1 = setTimeout(() => {
    io.emit(SOCKET_EVENTS.MAP_ITEMS, newMockLoations);
  }, 4 * MINUTE_IN_MILISECONDS);

  // imitation of deleting items
  const timeout2 = setTimeout(() => {
    io.emit(SOCKET_EVENTS.MAP_ITEMS, newMockLoations.slice(20));
  }, 8 * MINUTE_IN_MILISECONDS);

  // imitation of deleting items
  const timeout3 = setTimeout(() => {
    io.emit(SOCKET_EVENTS.MAP_ITEMS, newMockLoations.slice(40));
  }, 12 * MINUTE_IN_MILISECONDS);

  // imitation of appearing items
  const timeout4 = setTimeout(() => {
    io.emit(SOCKET_EVENTS.MAP_ITEMS, newMockLoations);
  }, 16 * MINUTE_IN_MILISECONDS);

  socket.on('disconnect', () => {
    // we need to clear timeouts in order not to send events after
    clearTimeout(timeout1);
    clearTimeout(timeout2);
    clearTimeout(timeout3);
    clearTimeout(timeout4);
    console.log('🔥: A user disconnected');
  });
});
