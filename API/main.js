common = require('../common.js');

var resource = function(path) {

	var arr = path.split('/');

	arr.splice(0,1);

	var obj = {};

	var key;

	var val;

	for (var idx in arr) {

		if (common.isEven(idx)) {

			key = arr[idx];

			obj[key] = '';

		} else {

			val = arr[idx];

			if (val.indexOf(',') > -1)

				val = val.split(',');

			obj[key] = val;

		}

	}

	return obj;

};

var getRoutes = function(callback) {

	var list = [];

	var path = './API/routes';

	common.listFiles(path, function(files) {

		for (var idx in files) {

			file = files[idx];

			if (file != '_default.js') {

				route = file.split('.');

				list.push(route[0]);

			}

		}

		callback(list);

	});

};

var getRequest = function(req) {

	var obj = {};

	obj.route = req.params.route;

	obj.method = req.method;

	if (req.path.length > 1)

		obj.resource = resource(req.path);

	if (Object.keys(req.body).length > 0)

		obj.data = req.body;

	if (Object.keys(req.query).length > 0)

		obj.query = req.query;

	return obj;

};

var getMethods = function(obj) {

	var arr = [];

	for (var key in obj) {

		arr.push(key);

	}

	return arr;

};

module.exports = {

	parse: function(req,res) {

		getRoutes(function(routes) {

			var request = getRequest(req);

			var route = request.route;

			var method = request.method;

			if (common.inArray(route,routes)) {

				var routed = require('./routes/' + route + '.js');

				var methods = getMethods(routed);

				if (common.inArray(method,methods)) {

					routed[method](request,res);

				} else {

					res.send('Method ' + method + ' not implemented!');

				}

			} else {

				res.send('Invalid route!');

			}

		});

	}

}