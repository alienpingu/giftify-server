const express = require('express')
const app = express()
const port = 5000
app.use(express.json()); // built-in middleware for express

const { Pool, Client } = require('pg')

require("dotenv").config();
const postgresURL = process.env.postgresURL;

const connectionString = postgresURL
const pool = new Pool({
  connectionString,
})

const client = new Client({
  	connectionString: connectionString
})
client.connect()

app.get('/', (req, res) => {
		res.status(200).send('Giftify Server')
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


app.listen(port, () => {
  console.log(`Giftify server start on  PORT: ${port}`)
})