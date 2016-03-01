var array = function(obj) {

	var arr = [];

	for (key in obj) {

		arr.push({

			[key]: obj[key]

		});

	}

	return arr;

};

var point = function(data,callback) {

	var lib = require('../../system/point.js');

	parse(data,lib, function(ok) {

		callback(ok);

	});

};

var device = function(data,callback) {

	var lib = require('../../system/device.js');

	parse(data,lib, function(ok) {

		callback(ok);

	});

};

var parse = function(data,lib,callback) {

	var len = data.length;

	var count = 0;

	(function loop(n) {

		if (n < len) {

			lib.command(data[n], function(ok) {

				if (ok)

					count++;

				loop(n + 1);

			});

		} else {

			if (len == count) {

				callback(true);

			} else {

				callback(false);

			}

			return;
		
		}

	})(0);

};

var response = function(ok,res) {

	if (ok) {

		res.send('Success!');

	} else {

		res.send('Failed!');

	}

};

module.exports = {

	GET: function(req,res) {

		if ((req.resource) && (req.query)) {

			var obj = req.resource;

			var data = array(req.query);

			for (var key in obj) {

				switch(key) {

					case 'device':

						device(data, function(ok) {

							response(ok,res);

						});

						break;

					case 'point':

						point(data, function(ok) {

							response(ok,res);

						});

						break;

					default:

						res.send('invalid request');

				}

			}
	
		} else {

			res.send('Invalid request!');

		}

	}

};