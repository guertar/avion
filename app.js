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

fs = require('fs');

/*var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
*/
// Chargement du fichier index.html affiché au client

var app = require('express')(),
    server = require('http').createServer(function(req, res) {
        fs.readFile('views/index.html', 'utf-8', function(error, content) {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(content);
        });
    }),
    io = require('socket.io').listen(server)

;


var io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket) {

    function intervalFunc() {
        //console.log("fff    ")
        pool.query('select * from vols where depart_date_reelle is not null and arrivee_date_reelle is null', (error, results) => {
            if (error) {        throw error   }



            socket.emit('vols',results.rows);
     });
    }

    setInterval(intervalFunc, 1500);

// Quand on client se connecte, on lui envoie un message

       pool.query('select * from vols where depart_date_reelle is not null and arrivee_date_reelle is null', (error, results) => {
        if (error) {        throw error   }
        socket.emit('vols',results.rows);
      });

    socket.on('voldetails', function(volId) {

        pool.query('SELECT * from vol_details where vol_id ='+volId, (err, response) => {
            if (err) {      throw err         }
            socket.emit('voldetails',response.rows);
        });

    });

    io.socket.get('/ddd', function() {

       socket.emit('inscription','/addVol');


    });


});
server.listen(8080);



