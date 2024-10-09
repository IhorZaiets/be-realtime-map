"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const routes_1 = require("./routes");
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const data_1 = require("./data");
const helpers_1 = require("./helpers");
dotenv.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const PORT = process.env.PORT ?? 3000;
app.use(express_1.default.json());
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send('<h2>Health check</h2>');
});
app.use('/api', routes_1.userRouter);
app.use((_, res) => {
    res.status(404).json('Not found');
});
server.listen(PORT, () => {
    console.log('API is listening on port', PORT);
});
// sockets
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:5173',
    },
});
io.on('connection', socket => {
    console.log(`⚡: ${socket.id} user just connected!`);
    io.emit('map_items', data_1.MOCK_LOCATIONS);
    const newMockLoations = data_1.MOCK_LOCATIONS.map(item => ({
        ...item,
        coords: {
            lng: item.coords.lng + (0, helpers_1.getRandomNumber)(0.001, 0.005),
            lat: item.coords.lat + (0, helpers_1.getRandomNumber)(0.001, 0.005),
        },
    }));
    setTimeout(() => {
        io.emit('map_items', newMockLoations);
    }, 2000);
    setTimeout(() => {
        io.emit('map_items', newMockLoations.slice(20));
    }, 4000);
    setTimeout(() => {
        io.emit('map_items', newMockLoations.slice(40));
    }, 6000);
    setTimeout(() => {
        io.emit('map_items', newMockLoations);
    }, 8000);
    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });
});
//# sourceMappingURL=index.js.map