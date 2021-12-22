const express = require('express')
const app = express()
const port = 5000

const { Pool, Client } = require('pg')

require("dotenv").config();
const postgresURL = process.env.postgresURL;

const connectionString = postgresURL
const pool = new Pool({
  connectionString,
})

const client = new Client({
  	connectionString: connectionString,
	ssl: {
        rejectUnauthorized: false,
    },
})

app.use(express.json()); // built-in middleware for express
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

client.connect()


//Get req
app.get('/', (req, res) => {
	res.status(200).send('ok')

})

//Post req

app.post('/save', (req, res) => {
	console.log(req.body)
	client
	  .query(`INSERT INTO coupon(options) VALUES ($1);`, [JSON.stringify(req.body)])
	  .then(res => console.log(res.rows[0]))
	  .catch(e => console.error(e.stack))
	res.status(200).send('ok')
})

app.post('/get', (req, res) => {
	const { id } = req.body
	console.log( id )
	res.status(200).send('ok')
})


app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});