module.exports = function(app) { 
    app.get('/', function (req, res) {
    //res.send('Hello World!')
    res.render('index', { title: 'Hey', message: 'Hello there!'});
  })
}