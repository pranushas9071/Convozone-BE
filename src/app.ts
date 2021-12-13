import express, { json } from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import unless from "express-unless";

import { contactsRouter, chatRouter } from "./routes";
import { jwtAuth } from "./services";

const app = express();
app.use(json());
app.use(cors());
dotenv.config();

const excludedPath = ["/contacts/login", "/contacts/register"];

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

io.on("connection", (socket) => {
  console.log(`A user connected`);

  socket.on("chat message", (msg) => {
    socket.broadcast.emit("sendToAllClients", msg);
  });

  socket.on("start typing", () => {
    socket.broadcast.emit("start typing");
  });

  socket.on("stop typing", () => {
    socket.broadcast.emit("stop typing");
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected`);
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
