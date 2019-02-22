class Client {
    constructor(nickname,photoUrl) {
        console.log(photoUrl)
        this.socket = io.connect('/'); // "socket" est un objet reprÃ©sentant ce socket client unique
        this.pseudo = nickname
        this._setPseudoAndPhoto(this.pseudo,photoUrl)
        this._initTypingObserver();
        this.socket.emit('user:new', this.pseudo);
        this.socket.on('message:history',(history)=>{
            this.displayMessagesHistory(history)
        })
        this.socket.on('connexion:new',(user)=>{
            console.log('Nouvelle coo '+ user)
        })
        this.socket.on('chanel:update',(canal,userList)=>{
            let html = '';
            $(userList).each((value,user)=>{
                console.log(user)
                html+= `<li>${user}</li>`
            })
            $(`#canal${canal}`).next().remove();
            console.log
            $(`#canal${canal}`).next().append(html);
            console.log(canal)
            console.log(userList)
        })
        this.socket.on('user:list',(usernameList)=>{
            this.updateUsersList(usernameList);
        })
        this.socket.on('notify:typing',(username)=>this.someoneIsTyping(username))
        this.socket.on('message:new', ({user,message,photoUrl}) => this.receiveMessage(user, message,photoUrl));
        this.socket.on('channels:userlist', (list)=>{
            for(channels in list){
                console.log(channels)
            }
        })
        this.typingNotificationTimer = 0;
    }

    init(){
        $('html').on('submit','form',(e)=>{
            e.preventDefault();
            this.sendMessage($('input').val());
           // socket.emit('message:new', $('input').val())
        })
        this._initTypingObserver();
        $('html').on('click','a',(e)=>{
            this.socket.emit('channel:change',$(e.target).data('channel'));
        })
    }

    updateUsersList(usernamesList){
        console.log(usernamesList);
        let template = '';
        console.log(usernamesList)
        usernamesList.forEach(username => {
            console.log(username);
            template += `<li>
                            ${username === this.pseudo 
                                ? `<strong>${username}</strong>`
                                : username
                            }
                        </li>`;
            console.log(template);
            $('#usersList').find('ul').html(template);
        })
    }
    someoneIsTyping(username){
        $('#notificationTypingZone').text(`${username} est en train d'écrire...`)
        clearTimeout(this.typingNotificationTimer);
        this.typingNotificationTimer = window.setTimeout(()=>{
            $('#notificationTypingZone').empty()
        },5000)
    }
    displayMessagesHistory(history){
        let messageHistory='';
        console.log(history)
        $(history).each((index,message)=>{
            console.log(message.message);
            messageHistory+=`<p><span>${message.pseudo} :</span> ${emojify(message.message)}</p>`
        })
        $('#messagesDisplayZone').html(messageHistory)
        console.log(messageHistory);
    }
    _initTypingObserver(){
        $('html').on('input','.messageZone',()=>{
            if($('input').val().trim() !== ''){
                console.log('test');
                this.notifyTyping();
            }
        })
    }

    notifyTyping(){
        this.socket.emit('notify:typing')
    }

    // Notifie le serveur du changement de nickname de ce client
    _setPseudoAndPhoto(pseudo,photoUrl){
        console.log(photoUrl);
        this.socket.emit('user:pseudo',pseudo,photoUrl)
    }

    // Ã‰met un message vers le serveur
    sendMessage(message) {
        this.socket.emit('message:new',message)
    }

    // ReÃ§oit un message de la part du serveur
    receiveMessage(pseudo, message,photoUrl) {
        console.log(photoUrl)
        $('#notificationTypingZone').empty();
        console.log(message)
        $('#chatMessages>div').first().append(`<p><img src='${photoUrl}'><span>${pseudo} :</span>${emojify(message)}</p>`);
    }
}
    function escapeRegExp(text) { 
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'); 
    } 
    
    function emojify(text) {
        console.log(text)
        const references = { 
            '128515' : [':D'], 
            '128522' : ['^^'], 
            '128521' : [';)'], 
            '128526' : ['B)', '8)'], 
            '128578' : [':)'], 
            '128516' : ['xD', 'XD'], 
            '128529' : ['-_-'], 
            '128547' : ['>_<'], 
            '128549' : [':\'('], 
            '128558' : [':o', ':O'], 
            '128539' : [':p', ':P'], 
            '128533' : [':/'], 
            '128577' : [':('], 
            '128545' : [':@', '-,-'], 
        };
        for (let codePoint in references) {
            let asciiArr = references[codePoint];
            asciiArr.forEach(ascii => {
                text = text.replace(
                    new RegExp(escapeRegExp(ascii), 'g'),
                    String.fromCodePoint(codePoint)
                );
            });
        }
        return text;
    }
