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

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});

client.connect()


//Get req
app.get('/', (req, res) => {
	res.status(200).send('ok')

})

//Post req

app.post('/save', (request, response) => {
	console.log(JSON.stringify(request.body))
	client
	  .query(`INSERT INTO coupon(options) VALUES ($1) RETURNING id;`, [JSON.stringify(request.body)])
	  .then(res => response.status(200).send(res.rows[0]))
	  .catch(e => console.error(e.stack))

	
})

app.post('/get', (request, response) => {
	const { id } = request.body
	client
	  .query(`SELECT options FROM coupon WHERE id = ${id};`)
	  .then(res => response.status(200).json(res.rows[0]))
	  .catch(e => console.error(e.stack))

})

app.post('/del', (request, response) => {
	const { id } = request.body
	client
	  .query(`DELETE FROM coupon WHERE id = ${id};`)
	  .then(res => response.status(200).send('ok'))
	  .catch(e => console.error(e.stack))
})


app.listen(process.env.PORT || port, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});