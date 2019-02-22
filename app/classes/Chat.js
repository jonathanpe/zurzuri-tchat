const ent = require('ent')

const User = require('./User')
const Channel = require('./Channel')

class Chat {
    constructor(io) {
        this.channels = {};
        this.io = io
        this.users = [] // Liste des utilisateurs
        this.messages = [] // Liste des messages
        this.buildsChannels('General','Gaming','Random')
    }

    onConnection(socket) {
        console.log('✅  Client', socket.id, 'is connected via WebSockets')

        socket.once('user:pseudo',(pseudo,photoUrl)=>{

            const user = new User(socket,pseudo,photoUrl);
            this.channels['General'].addUser(user);
            socket.join('General');
         //   console.log(this.getChannelById(2));
            //user.channelId =this.channels['General']
            socket.on('channel:change',(channel)=>{
                let $oldChannel = this.getChannelById(user.channelId);
                let $newChannel = this.channels[channel]

                $oldChannel.removeUser(user);
                $newChannel.addUser(user);

                this.io.to(channel).emit('connexion:new',user.nickname);

            })
            //Ajout d'un utilisateur à la liste 
            this.users.push(user)
            socket.emit('message:history',this.getMessagesList());
            this.io.sockets.emit('user:list',this.getUsernameList());
            socket.on('message:new', (message) => {this._onNewMessage(socket, user, message)}) 
            socket.on('disconnect',()=> this._onUserDisconnect(user))
            socket.on('notify:typing', ()=>{
                this._onTyping(socket, user)
            })
        })
    }


    getChannelById(id) {
        for (let channel in this.channels){
            if(this.channels[channel]._id===id)return this.channels[channel];
        }
    }

    getUsernameList(){
        return this.users.map(value=>{
            return value.nickname
        });
    } 

    _onUserDisconnect(user){
         let index = this.users.indexOf(user);
        if(index > -1){
           this.users.splice(index, 1) 
            user.destroy();
           this.io.sockets.emit('user:list',this.getUsernameList())
        }
    }
   /**  connectToChannel(channel){
        socket.on('channel:change',this.getUserInChannel())
   }*/

   /**  getUserInChannel(){
        socket.emit()
    }*/
    
    listUsers(){
        return this.users;
    }
    getMessagesList(){
        return this.messages.slice(-20);
    }

    _onTyping(socket,user){
        socket.broadcast.emit('notify:typing',user.nickname)
    }

    _onNewMessage(socket, user, message) {
       let userInfos = {
            pseudo : user.nickname,
            photoUrl : user.photoUrl,
            message : message
        }
        this.messages.push(userInfos);
        console.log('test')
        this.io.to(this.getChannelById(user.channelId).title).emit('message:new', {user : userInfos.pseudo, message: userInfos.message, photoUrl : userInfos.photoUrl})
    }

    buildsChannels(...channelListNames){

        this.channels = channelListNames.map(channel => {
                            return new Channel(this.io,channel)
                        })
                        .reduce((acc, channelObj) => {
                        acc[channelObj.title] = channelObj
                        return acc
                        }, {});
       // console.log(channelArray);
      // var [channelListNames]=channelArray;
    // console.log(channelListNames)
    }
}

module.exports = Chat
