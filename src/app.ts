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

io.on("connection", (socket) => {

  const decodedData: any = jwtService.verifyToken(
    socket.handshake.query.token as string
  ).data;
  socketMap.set(decodedData.username, socket.id);

  socket.on("chat message", (data) => {
    socket.broadcast.to(socketMap.get(data.to)).emit("messageAlert", data.info);
  });

  socket.on("start typing", (data) => {
    socket.broadcast.to(socketMap.get(data.to)).emit("start typing");
  });

  socket.on("stop typing", (data) => {
    socket.broadcast.to(socketMap.get(data.to)).emit("stop typing");
  });

  socket.on("disconnect", () => {
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
