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

function delPlayer(socketId){
    for(let i = 0 ; i < 2; i++){
        if(players[i] == socketId){
            players.splice(i,1);
        }
    }
}

Socketio.on("connection", socket =>{
    socket.on("isFull",(bool)=>{
        if(players.length < 2){
            Socketio.to(socket.id).emit("isFull", false);
        }
        else{
            Socketio.to(socket.id).emit("isFull", true);
        }
    });

    socket.on("joinRoom", (roomCode) =>{
        if(players.length < 2){
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
        }
    });

    socket.on("disconnect",() =>{
        delPlayer(socket.id);
    })

    socket.on("leaveRoom", (roomCode) =>{
        socket.leave(roomCode);
        players = [];
    })

    socket.on("leave", (roomCode) =>{
        socket.leave(roomCode);
        delPlayer(socket.id);
        Socketio.to(roomCode).emit("leave",roomCode);
    })



    socket.on("move", (data, roomCode) =>{
        subfield = data;
        socket.broadcast.to(roomCode).emit("position", subfield);
    });
});

Http.listen(3000, () =>{
    console.log("Listening at : 3000...");
})
