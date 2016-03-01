var query = function(cmd,req,res) {

	var db = require('./nosql.js');

	var obj = {};

	if (req.route) {

		obj.collect = req.route;

		obj.where = req.resource;

		obj.select = req.query;

		obj.insert = req.data;

		db[cmd](obj, function(data) {

			res.send(data);

		});

	} else {

		res.send('Invalid request!');

	}

};

module.exports = {

	GET: function(req,res) {

		query('read',req,res);

	},

	POST: function(req,res) {

		query('insert',req,res);

	},

	PUT: function(req,res) {

		query('update',req,res);

	},

	DELETE: function(req,res) {

		query('remove',req,res);
	
	}

}