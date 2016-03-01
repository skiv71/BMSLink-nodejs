var db = require('../API/nosql.js');

var extend = require('extend');

var point = function(obj,callback) {

	var arr = obj.data.split('=');

	delete obj.data;

	obj.point = arr[0];

	obj.value = arr[1];

	obj.timestamp = obj.timestamp.toString();

	callback(obj);

};

var cmdQuery = function(data) {

	var obj = {};

	obj.collect = 'control';

	obj.where = {};

	obj.where.name = data;

	obj.select = {};

	obj.select.device = '';

	obj.select.point = '';

	return obj;

};

var readQuery = function(data) {

	var obj = {};

	obj.collect = 'points';

	obj.where = {};

	obj.where.device = data.device;

	obj.where.point = data.point;

	obj.select = {};

	obj.select.id = '';

	return obj;

};

var insertQuery = function(data) {

	var obj = {};

	obj.collect = 'points';

	obj.insert = {};

	obj.insert.device = data.device;

	obj.insert.point = data.point;

	obj.insert.type = data.type;

	obj.insert.value = data.value;

	obj.insert.units = '';

	obj.insert.timestamp = data.timestamp;

	obj.insert.logging = '0';

	obj.insert.purge = '0';

	obj.insert.alias = '';

	return obj;

};

var updateQuery = function(data) {

	var obj = {};

	obj.collect = 'points';

	obj.select = {};

	obj.select.value = data.value;

	obj.select.timestamp = data.timestamp;

	return obj;

};

var setPoint = function(obj,callback) {

	var device = require('./' + obj.type + '/main.js');

	device.setPoint(obj, function(ok) {

		callback(ok);

	});

};

var getCon = function(data) {

	var dev = require('./device.js');

	var sn;

	var pnt;

	for (var idx in data) {

		for (var key in data[idx]) {

			if (key == 'device') {

				sn = data[idx][key];

				var con = dev.connection(sn);

			}

			if (key == 'point') {

				if (con) {

					pnt = data[idx][key];

					extend(con,{

						point: pnt

					});

					return con;

				}

			}

		}

	}

};

module.exports = {

	command: function(obj,callback) {

		var name;

		var cmd;

		var query;

		for (var key in obj) {

			name = key;

			cmd = obj[key];

			query = cmdQuery(name);

			db.read(query, function(data) {

				var con = getCon(data);

				if (con) {

					extend(con,{

						cmd: cmd

					});

					setPoint(con, function(ok) {

						callback(ok);

					});

				}
		
			});

		}

	},

	update: function(obj,callback) {
	
		var query;

		var method;

		point(obj, function(point) {

			query = readQuery(point);

			db.read(query, function(data) {

				if (data.length > 0) {

					method = 'update';

					query = updateQuery(point);

					query.where = data[0];

				} else {

					method = 'insert';

					query = insertQuery(point);
					
				}

				db[method](query, function(data) {

					console.log(data);

					callback();

				});

			});

		});

	}

};
