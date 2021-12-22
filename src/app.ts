import express, { json } from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import unless from "express-unless";

import { contactsRouter, chatRouter } from "./routes";
import { jwtAuth, jwtService } from "./services";

const app = express();
app.use(json());
app.use(cors());
dotenv.config();

const excludedPath = [
  "/contacts/login",
  "/contacts/register",
  "/contacts/validate",
];

const auth: any = jwtAuth;
auth.unless = unless;
app.use(
  auth.unless({
    path: excludedPath,
  })
);

app.use("/chat", chatRouter);
app.use("/contacts", contactsRouter);

const server = http.createServer(app);
const io = new Server(server);
const socketMap = new Map();
let onlineUsers: string[] = [];

io.on("connection", (socket) => {
  const decodedData: any = jwtService.verifyToken(
    socket.handshake.query.token as string
  ).data;
  socketMap.set(decodedData.username, socket.id);

  socket.on("chat message", (data) => {
    io.to(socketMap.get(data.to)).emit("messageAlert", data.info);
  });

  socket.on("alert online", (data) => {
    if (!onlineUsers.includes(decodedData.username)) {
      onlineUsers.push(decodedData.username);
    }
    socket.broadcast.emit("online", decodedData.username);
  });

  socket.on("check user state", (data) => {
    if (onlineUsers.includes(data.user))
      io.to(socketMap.get(decodedData.username)).emit("online", data.user);
    else io.to(socketMap.get(decodedData.username)).emit("offline");
  });

  socket.on("start typing", (data) => {
    io.to(socketMap.get(data.to)).emit("start typing", decodedData.username);
  });

  socket.on("stop typing", (data) => {
    io.to(socketMap.get(data.to)).emit("stop typing", decodedData.username);
  });

  socket.on("disconnect", () => {
    onlineUsers.splice(onlineUsers.indexOf(decodedData.username), 1);
    socket.broadcast.emit("offline", decodedData.username);
    socketMap.forEach((value, key, map) => {
      if (socket.id === value) {
        socketMap.delete(key);
      }
    });
  });
});

let URL = "";
if (!!process.env.CONNECTION && !!process.env.DATABASE)
  URL = process.env.CONNECTION + process.env.DATABASE;
const PORT = process.env.PORT;

mongoose
  .connect(URL)
  .then((result) => {
    console.log("Connected to db..");
    server.listen(PORT, () => {
      console.log(`Server started at port : ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
