class Channel {
    constructor(io, title) {
        this.io    = io
        this._id = Channel.counter;
        this.title = title // Nom du channel
        this.users = [] // Chaque channel va gÃ©rer sa propre liste d'utilisateurs
    }

    get _idChannel() {
        return this._id;
    }

    static get counter() {
        Channel._counter = (Channel._counter || 0) + 1;
        return Channel._counter;
    }

    addMessage(user, room, message) {
        
    }

    addUser(user) {
        user.socket.join(this.title);
        console.log(`${user.nickname} a rejoint le canal ${this.title} `);
        user.channelId=this._id;
        this.users.push(user);
        let usersOnNewChannel = this.users.map(user=>user.nickname)
        this.io.sockets.emit('chanel:update',this.title,usersOnNewChannel)
        return usersOnNewChannel;
    }

    removeUser(user) {
        user.socket.leave(this.title);
        console.log(`${user.nickname} a quitté le canal ${this.title} `);
        this.users.splice(this.users.indexOf(user),1);
        let usersonOldChannel = this.users.map(user=>user.nickname)
        this.io.sockets.emit('chanel:update',this.title,usersonOldChannel);
        return usersonOldChannel;
    }
    
    getUsersList() {}

    destroy() {}
}

module.exports = Channel