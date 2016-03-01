var db = require('../API/nosql.js');

var baseQuery = function(device) {

	var obj = {};

	obj.collect = 'devices';

	obj.where = {};

	obj.where.serial = device;

	obj.select = {};

	return obj;

};

var type = function(serial,callback) {

	var types = [

		'rfxcom'

	];

	var type;

	var query = baseQuery(serial);

	query.select.type = '';

	db.read(query, function(data) {

		if (data) {

			type = data[0].type;

		}

		if ((type) && (common.inArray(type,types))) {

			callback(type);
	
		} else {

			callback();

		}

	});

};

var start = function(serial,callback) {

	type(serial, function(type) {

		var con = connection(serial);

		if ((type) && (!con)) {

			var device = require('./' + type + '/main.js');

			device.start(serial, function(ok) {

				callback(ok);

			});
		
		} else {

			callback(false);

		}

	});

};

var stop = function(serial,callback) {

	var con = connection(serial);

	if (con) {

		con.socket.end();

		callback(true);

	} else {

		callback(false);

	}

};

var connection = function(serial) {

	for (var idx in connections) {

		if (connections[idx].device == serial)

			return connections[idx];

	}

};

module.exports = {

	command: function(obj,callback) {

		var sn;

		var cmd;

		for (var key in obj) {

			sn = key;

			cmd = obj[key];

			switch(cmd) {

				case 'start':

					start(sn, function(ok) {

						callback(ok);

					});

					break;

				case 'stop':

					stop(sn, function(ok) {

						callback(ok);

					});

					break;

				default:

					callback(false);

			}

		}

	},

	port: function(serial,callback) {

		var query = baseQuery(serial);

		query.select.host = '';

		query.select.port = '';

		db.read(query, function(data) {

			if (data.length == 1) {

				callback(data[0]);

			} else {

				callback();

			}

		});

	},

	connection: function(serial) {

		return connection(serial);

	}

}