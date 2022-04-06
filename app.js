const express = require("express");
const mongojs = require("mongojs");
const routes = require('./routes.js');
const bodyParser = require('body-parser');

const app = express();

var databaseUrl = "rakryan";

global.db = mongojs(databaseUrl);

db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Routes
app.get('/', function(req, res) {
	res.send('API Rakryan')
})

app.use('/api', routes)

app.listen(5000, function() {
	console.log('listening on 5000')
})

