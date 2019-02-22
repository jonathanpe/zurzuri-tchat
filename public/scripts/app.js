'use strict';

var config = {
    apiKey: "AIzaSyB_80ULjeeo6uQL80N4ja-aXi9Bt-ti1ac",
    authDomain: "zurzuri-chat.firebaseapp.com",
    databaseURL: "https://zurzuri-chat.firebaseio.com",
    projectId: "zurzuri-chat",
    storageBucket: "zurzuri-chat.appspot.com",
    messagingSenderId: "93011748973"
  };
firebase.initializeApp(config);

$(`#loginGoogle`).on('click',(e)=>{
    e.preventDefault();
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        const client = new Client(user.displayName,user.photoURL);
        const socket = io.connect('http://localhost:9000');
        $('.notConnected').replaceWith(`<div class='connected'><p>Connecté en tant que : <span>${result.user.displayName}</span></p></div>`);
        client.init();
        console.log(token, user)
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
})
//const pseudo = prompt('Choisissez un pseudo');
// écouter le serveur pour d'autres messages

//socket.on('message', function(data) {
    //console.log(data)
    //$('#chatMessages>div').append(`<p><span>${pseudo} :</span>${data}</p>`);
//})

/** 
$('.disconenct').on('click',()=>{

})
*/