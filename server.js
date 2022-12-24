const { Socket } = require('engine.io');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 3000;

const names = {};

http.listen(PORT,() =>{
    console.log(`listening on port ${PORT}`);
});

app.use(express.static(__dirname + '/public'));

app.get('/',(req,res) => {
    res.sendFile(__dirname + '/index.html')
})

//socket
const io = require('socket.io')(http);
io.on('connection',(socket) => {
    console.log("Connected");
    socket.on('message',(msg1) => {
        socket.broadcast.emit('message',msg1)
    });
    socket.on('new-user',(name) => {
        names[socket.id] = name;
        socket.broadcast.emit('new-user',name)
    });
    socket.on('disconnect',() => {
        socket.broadcast.emit('left',names[socket.id]);
        delete names[socket.id];
    });
});