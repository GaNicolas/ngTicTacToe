const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http, {
    cors:{
        origin: "*",
        methods: ["GET", "POST"]
    }
});

var subfield;

Socketio.on("connection", socket =>{
    
    socket.on("joinRoom", (roomCode) =>{
        socket.join(roomCode);
    })

    socket.on("move", ({data, roomCode})  =>{
        subfield = data;
        socket.broadcast.to(roomCode).emit("position", subfield);
    });

    socket.on("disconnet",() =>{
        console.log("User disconnected");
    });
});




Http.listen(3000, () =>{
    console.log("Listening at : 3000...");
})
