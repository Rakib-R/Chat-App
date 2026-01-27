import express, { type Request, type Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import next from 'next';

const dev: boolean = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);

  // Initialize Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Socket.io Logic
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (roomId: string, userId: string) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-connected', userId);

      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId);
      });
    });

    // FOR PREVENTING LISTENER LEAKS WITH MORE THAN 2 USERS
    socket.on('disconnecting', () => {
       // socket.rooms is a Set containing the socket ID and the rooms it joined
       for (const room of socket.rooms) {
         if (room !== socket.id) {
           // You might need to store the userId associated with this socket separately
           // to emit the correct ID here.
           // socket.to(room).emit('user-disconnected', userId); 
         }
       }
    });
  });

  // Use a Regex literal /.*/ instead of string '*' or '.*'
  server.all(/.*/, (req: Request, res: Response) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  
  httpServer.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
}).catch((err: any) => {
  console.error(err);
  process.exit(1);
});