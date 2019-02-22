const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 9000
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'pug');
require('./router.js')(app);
require('./websocket.js')(app,io);

http.listen(PORT, function () {
  console.log('Example app listening on port 9000!')
})
