class User {
    constructor(socket, nickname,photoUrl) {
        this.id        = socket.id
        this.nickname  = nickname
        this.photoUrl = photoUrl
        this.socket    = socket
        this.channelId = 1;
    }

    destroy() {
        this.id = null
        this.nickname = null
        this.photoUrl = null
        this.socket.disconnect()
    }
    setIdChannel(id){
        this.channelId = id;
    }
}

module.exports = User