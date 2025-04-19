import morgan from 'morgan';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import AuthRoutes from './routes/Auth.js';
import DbCon from './db/db.js';
import MessageRoutes from './routes/Messages.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development'; // Default to 'development'
const app = express();

// Database connection
DbCon();

app.use(express.json());
app.use(cors());
app.use(morgan("combined"));
// API routes
app.use('/api/Auth', AuthRoutes);
app.use('/api/messages', MessageRoutes);

// Serve static files from the public directory
const __dirname = path.resolve();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, './Frontend/dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './Frontend/dist', 'index.html'));
});

// Create HTTP Server
const server = createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*', // Update with your frontend domain for production
    methods: ['GET', 'POST'],
  },
});

let users = [];

const AddUser   = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

const RemoveUser   = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const GetUser   = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  // When connected
  console.log('A user connected', socket.id);
  
  socket.on('AddUser  Socket', (userId) => {
    console.log('User   ID:', userId);
    AddUser  (userId, socket.id);
    io.emit('getUsers', users);
    console.log('Users from socket:', users);
  });

  // Message handling
  socket.on('sendMessage', (data) => {
    const { senderId, receiverId, message } = data.messagedata;
    console.log('Receiver ID:', receiverId);
    const user = GetUser  (receiverId);
    console.log('Sender User:', user);
    
    if (user?.socketId) {
      io.to(user.socketId).emit('receiveMessage', {
        userId: senderId,
        message,
      });
    } else {
      console.log('Receiver not connected');
    }
    console.log('Message data:', data);
  });

  // When disconnected
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    RemoveUser  (socket.id);
    io.emit('getUsers', users);
    console.log(users);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
});