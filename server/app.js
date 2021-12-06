const { Socket } = require("socket.io");

const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http, {
    cors:{
        origin: "*",
        methods: ["GET", "POST"]
    }
});

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

var subfield;
var id=0;
let players = [];

Socketio.on("connection", socket =>{
    socket.on("joinRoom", (roomCode) =>{
        socket.join(roomCode);
       if(Socketio.sockets.adapter.rooms.get(roomCode).size <= 2){
        players[Socketio.sockets.adapter.rooms.get(roomCode).size -1 ] = socket.id;
        const rndInt = randomIntFromInterval(0,1);
        id = roomCode;
        if(Socketio.sockets.adapter.rooms.get(roomCode).size == 2){
            Socketio.to(players[rndInt]).emit("isTurn", true);
            Socketio.to(players[(rndInt+1) %2]).emit("isTurn", false);
            Socketio.to(roomCode).emit("onStart", true);
        }
       }
    });

    socket.on("leaveRoom", (roomCode) =>{
        socket.leave(roomCode);
        players = [];
    })



    socket.on("move", (data, roomCode) =>{
        subfield = data;
        socket.broadcast.to(roomCode).emit("position", subfield);
    });
});

Http.listen(3000, () =>{
    console.log("Listening at : 3000...");
})
