var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');


const connectionString = 'postgresql://postgres:admin@localhost:5432/vol';
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'vol',
    password: 'admin',
    port: 5432,
})


var server = http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;

    switch (path) {
        case '/':
            fs.readFile('views/index.html', 'utf-8', function (error, content) {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.end(content);
            });
            break;
        case '/inscription':
            fs.readFile('views/addClient.html', 'utf-8', function (error, data) {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(data, "utf8");
                response.end();
            });
            break;
        case '/connexion':
            fs.readFile('views/connexion.html', 'utf-8', function (error, data) {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(data, "utf8");
                response.end();
            });
            break;
        case '/addAvion':
            fs.readFile('views/addAvion.html', 'utf-8', function (error, data) {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(data, "utf8");
                response.end();
            });
            break;
        default:
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
            response.end();
            break;
    }
});

server.listen(8080);
var listener = io.listen(server);

listener.sockets.on('connection', function (socket) {

    function intervalFunc() {
        //console.log("fff    ")
        pool.query('select * from vols where depart_date_reelle is not null and arrivee_date_reelle is null', (error, results) => {
            if(error) {
                throw error
            }
            socket.emit('vols', results.rows);
    })
        ;
    }
    setInterval(intervalFunc, 1500);

    pool.query('select * from vols where depart_date_reelle is not null and arrivee_date_reelle is null', (error, results) => {
        if(error) {
            throw error
        }
        socket.emit('vols', results.rows);
})
    ;

    socket.on('voldetails', function (volId) {

        pool.query('SELECT * from vol_details where vol_id =' + volId, (err, response) => {
            if(err) {
                throw err
            }
            socket.emit('voldetails', response.rows);
          })
        ;

    });

    socket.on('inscription', function (message) {
            console.log("message",message);
            //Il faut créer une sql pour insérer le client a la DB, Nice to have: vérifier qu'il n'existe pas déja

    });

    socket.on('loginClient', function (message) {
        console.log("message",message);
        //Il faut créer une sql pour insérer le client a la DB, Nice to have: vérifier qu'il n'existe pas déja

    });

    socket.on('loginAdmin', function (message) {
        console.log("message",message);

    });

});


