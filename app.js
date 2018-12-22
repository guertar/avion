var app = require('express')(),

    server = require('http').createServer(app),
    io = require('socket.io').listen(server)


// Chargement de la page index.html

//app.disable('view cache');


const connectionString = 'postgresql://postgres:admin@localhost:5432/vol'
const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'vol',
    password: 'admin',
    port: 5432,
})


var getUsers = (req,res) => {pool.query('SELECT * from vol', (error, results) => {
    if (error) {
        throw error
    }

    res.render('vols.ejs', {results: results.rows});
})

}
var getDetails = (req,res) => {
    pool.query('SELECT * from vol_details where vol_id ='+req.params.vol_id, (err, response) => {
    if (err) {
        throw err
    }
    res.render('voldetails.ejs', {details:response.rows});

})

}

app.get('/', getUsers);

app.get('/voldetails/:vol_id', function(req,res){
    getDetails(req,res);

});


server.listen(8080);