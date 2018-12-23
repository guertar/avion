const connectionString = 'postgresql://postgres:admin@localhost:5432/vol'
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'vol',
    password: 'admin',
    port: 5432,
})
var http = require('http');

var getUsers =

    pool.query('SELECT * from vol', (error, results) => {
    if (error) {        throw error   }
     results.rows;
    })


var getDetails = (req,res) => {
    pool.query('SELECT * from vol_details where vol_id ='+req.params.vol_id, (err, response) => {
    if (err) {
        throw err
    }
    res.render('voldetails.ejs', {details:response.rows});

})

}

fs = require('fs');

/*var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
*/
// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('views/index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});


var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
// Quand on client se connecte, on lui envoie un message

       pool.query('SELECT * from vol', (error, results) => {
        if (error) {        throw error   }
        socket.emit('vols',results.rows);
      });

    socket.on('voldetails', function(volId) {

        pool.query('SELECT * from vol_details where vol_id ='+volId, (err, response) => {
            if (err) {      throw err         }
            socket.emit('voldetails',response.rows);
        });

    });
});
// On signale aux autres clients qu'il y a un nouveau venu
  //  socket.broadcast.emit('message', 'Un autre client vient de se     connecter ! ');
// Dès qu'on nous donne un pseudo, on le stocke en variable de    session
   /*socket.on('vols', function() {
        //socket.set('pseudo', pseudo);
       console.log(' ffffffffff' );
    });*/
// Dès qu'on reçoit un "message" (clic sur le bouton), on le    note dans la console
  //  socket.on('message', function (message) {
// On récupère le pseudo de celui qui a cliqué dans les        variables de session
   //     socket.get('pseudo', function (error, pseudo) {
   //         console.log(pseudo + ' me parle ! Il me dit : ' +
   //             message);
  //      });
  //  });
   /*



app.get('/voldetails/:vol_id', function(req,res){
    getDetails(req,res);

});
app.get('/vols', getUsers);
*/
server.listen(8080);



