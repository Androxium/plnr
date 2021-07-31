const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app, {
    cors: { origin: "*" },
});
const { Server } = require("socket.io");
const io = new Server(server);
const PORT = 3000;

io.on("connection", (socket) => {
    console.log("user is connected");

    socket.on("disconnect", () => {
        console.log("a user has disconnected");
    });

    socket.on("location:create", (location) => {
        console.log(location);
        io.emit("location:create", location);
    });
});

server.listen(PORT, () => {
    console.log("listening on port", PORT);
});
