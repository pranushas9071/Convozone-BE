import express, { json } from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { contactsRouter, userRouter } from "./routes";

const app = express();
app.use(json());
app.use(cors());
dotenv.config();

app.use("/user", userRouter);
app.use("/contacts", contactsRouter);
app.get("/", (req, res) => {
  res.send("hi");
});

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`A user connected`);

  socket.on("chat message", (msg) => {
    console.log(`Message : ${msg}`);
    // io.emit("chat message", msg);
    socket.broadcast.emit("sendToAllClients", msg);
  });

  socket.on("start typing", () => {
    console.log("A user is typing..");
    socket.broadcast.emit("start typing");
  });

  socket.on("stop typing", () => {
    console.log("A user stopped typing...");
    socket.broadcast.emit("stop typing");
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected`);
  });
});

// server.listen(3000, () => {
//   console.log(`Server started at the port : ${3000}`);
// });

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
