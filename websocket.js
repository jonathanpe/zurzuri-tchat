const ent = require('ent');
const Chat = require('./app/classes/Chat.js');
module.exports = function(app, io){
    const chat = new Chat(io);
    io.on('connection',(socket)=>{
        chat.onConnection(socket);
        /** socket.on('message:new',({pseudo,message})=>{
            chat._onNewMessage(socket,pseudo,message)
        })*/
    })
  /*  io.on('connection', function(socket){
    console.log(` ${socket.id} connected`);
    socket.on('message:new',({pseudo,message})=>{
        console.log('testok');
        message = message;
        pseudo = pseudo;

        io.sockets.emit('message:new',{pseudo,message})
    })
  });*/
}