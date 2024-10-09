import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { userRouter } from './routes';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { MOCK_LOCATIONS } from './data';
import { getRandomNumber } from './helpers';

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

  // imitation of moving items
  const newMockLoations = MOCK_LOCATIONS.map(item => ({
    ...item,
    coords: {
      lng: item.coords.lng + getRandomNumber(0.001, 0.005),
      lat: item.coords.lat + getRandomNumber(0.001, 0.005),
    },
  }));

  // imitation of moving items
  setTimeout(() => {
    io.emit('map_items', newMockLoations);
  }, 2000);

  // imitation of deleting items
  setTimeout(() => {
    io.emit('map_items', newMockLoations.slice(20));
  }, 4000);

  // imitation of deleting items
  setTimeout(() => {
    io.emit('map_items', newMockLoations.slice(40));
  }, 6000);

  // imitation of appearing items
  setTimeout(() => {
    io.emit('map_items', newMockLoations);
  }, 8000);

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });
});
