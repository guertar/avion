var app = require('express')(),

    server = require('http').createServer(app),
    io = require('socket.io').listen(server)


// Chargement de la page index.html
var results = [];
//app.disable('view cache');


const connectionString = 'postgresql://postgres:admin@localhost:5432/vol'

const pg = require('pg');
const pool = new pg.Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'vol',
    password: 'admin',
    port: '5432'});

results = pool.query('SELECT * from vol', (err, res) => {
    console.log(res);
results=res;
pool.end();
});

app.get('/', function (req, res) {


    res.render('vols.ejs', {results:results});
});

app.get('/voldetails/:vol_id', function(req, res) {

    const pool = new pg.Pool({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'vol',
        password: 'admin',
        port: '5432'});

    var id = req.url.id;


    pool.query('SELECT * from vol_details where vol_id ='+req.params.vol_id, (err, res) => {

        details=res;
    pool.end();
});


    res.render('voldetails.ejs', {details:details});
});

server.listen(8080);