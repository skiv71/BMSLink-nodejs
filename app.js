// initialise

connections = [];

// express framework

var express = require('express');

var app = express();

// busboy (form-data) module

var busboy = require('express-busboy');

busboy.extend(app);

// system

require('./system/main.js');

// API

var api = require('./API/main.js');

app.use('/api/:route', function (req,res) {

	api.parse(req,res);

});

// public

app.use(express.static('public'));

app.get('/', function(req,res) {

});

// start web port

var port = '80';

app.listen(port, function () {

  	console.log('Starting webserver, port: ' + port);

});