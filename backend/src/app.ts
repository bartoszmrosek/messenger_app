import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: {
    origin: "*"
}});

io.on("connection", (socket) => {
  socket.on('checkOrCreateUser', (arg, callback)=>{
    const {data} = arg;
    console.log(data)
    callback(true)
  })
});

httpServer.listen(8000);