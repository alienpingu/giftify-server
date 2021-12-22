const express = require('express')
const app = express()
var cors = require('cors')
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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors())

client.connect()

app.get('/', (req, res) => {
	res.status(200).send('ok')
})

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