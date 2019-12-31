var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var roomMembers = new Array();

app.use(express.static('public'));

server.listen(3000);
console.log('Server started.');


io.sockets.on('connection', clientConnected);


function clientConnected(socket) {

    socket.on('disconnect', function () {
        console.log('Client  ' + socket.handshake.address + '  disconnected.');
        io.to(socket.room).emit("message", {type: "user_left", data: socket.nickname});
        if (roomMembers[socket.room]) {
            roomMembers[socket.room].splice(roomMembers[socket.room].indexOf(socket.nickname), 1);
            updateRoomMembers(socket.room);
        }
    });
    socket.on('login', function (data) {
        console.log('Client Login  ', data);
        socket.nickname = data.nickname;
        socket.room = data.room;
        socket.join(data.nickname);
        socket.join(data.room);
        socket.broadcast.to(data.room).emit("message", {type: "new_user_login", data: data.nickname});

        if (!roomMembers[socket.room]) {
            roomMembers[socket.room] = [];
        }
        roomMembers[socket.room].push(data.nickname);
        updateRoomMembers(socket.room);


    });

    socket.on('getRoomClients', function () {
        io.sockets.to(socket.nickname).emit("message", {type: "get_user_list", data: roomMembers[socket.room]});
    })

    socket.on('sendMessage', function (message) {
        io.sockets.to(socket.room).emit("message", {
            type: "get_message",
            data: {nickname: socket.nickname, message: message}
        })
    });

    socket.on("createOffer",function(createOfferObject){
        console.log("createOffer",createOfferObject);
        for(let i=0;i<roomMembers[socket.room].length;i++){
            if(roomMembers[socket.room][i] != socket.nickname){
                io.sockets.to(roomMembers[socket.room][i]).emit("message", {type: "get_create_offer",data : createOfferObject})
            }
        }
    });

    socket.on("createAnswer",function(createAnswerObject){
        console.log("createAnswer",createAnswerObject);
        for(let i=0;i<roomMembers[socket.room].length;i++){
            if(roomMembers[socket.room][i] != socket.nickname){
                io.sockets.to(roomMembers[socket.room][i]).emit("message", {type: "get_create_answer",data : createAnswerObject})
            }
        }
    });

    socket.on("onIceCandidate",function(iceObject){
        console.log("onIceCandidate",iceObject);
        for(let i=0;i<roomMembers[socket.room].length;i++){
            if(roomMembers[socket.room][i] != socket.nickname){
                if(iceObject.peer == "remote"){
                    io.sockets.to(roomMembers[socket.room][i]).emit("message", {type: "publish_ice_candidate",data : iceObject.ice})
                }else {
                    io.sockets.to(roomMembers[socket.room][i]).emit("message", {type: "play_ice_candidate",data : iceObject.ice})
                }
            }
        }
    });



}

function updateRoomMembers(room) {

}


