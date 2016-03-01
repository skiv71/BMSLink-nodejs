var device;

var host;

var port;

var conn;

var stream;

var connect = function(callback) {

	var dev = require('../device.js');

	dev.port(device, function(obj) {

		host = obj.host;

		port = obj.port;

		console.log('connecting to host ' + host + ' on port ' + port);

		common.connect(host, port, function(con) {

			if (con) {
		
				callback(con);

			} else {

				callback();

			}

		});
	
	});

};

var addConn = function(con) {

	conn = con;

	var obj = {};

	obj.device = device;

	obj.type = 'rfxcom';

	obj.socket = conn;

	obj.host = host;

	obj.port = port;

	connections.push(obj);

};

var remConn = function() {

	for (var idx in connections) {

		if (connections[idx].device == device) {

			connections.splice(idx,1);

			return;

		}

	}

};

var poll = function() {

	var stream;

	var reset = '0d00000000000000000000000000';

	var status = '0d00000102000000000000000000';

	conn.setEncoding('hex');

	console.log('sending reset!');

	conn.write(reset, 'hex', function() {

		setTimeout(function() {

			console.log('requesting status');

			conn.write(status, 'hex', function() {

				conn.on('data', function(data) {

					hex(data, function(hex) {

						if (hex)

							decode(hex);

					});

				});

				conn.on('end', function() {

					remConn();

					console.log('stopped rfxcom: ' + device);

				});

			});

		},500);

	});

};

var hex = function(data,callback) {

	if (stream) {

		stream += data;

	} else {

		stream = data;

	}

	var str;

	while (!str) {

		var len = parseInt(stream.substr(0,2),16);

		if ((len >= 4 ) && (len <= 13)) {

			var end = (len * 2) + 2;

			if (stream.length >= end) {

				str = stream.substr(0,end).toUpperCase();

				stream = stream.substr(end);

			} else {

				callback();

				return;

			}

		} else {

			if (stream.length >= 2) {

				stream = stream.substr(2);

			} else {

				callback();

				return;

			}

		}

	}

	callback(str);

};

var decode = function(hex) {

	var lib = require('./decode.js');

	var point = require('../point.js');

	var types = lib.types();

	var type = lib.type(hex);

	if (common.inArray(type,types)) {

		var dec = lib[type](hex);

		console.log('decoded: ' + device + ' ' + dec.join(', '));

		(function loop(n) {

			if (n < dec.length) {

				if (dec[n].indexOf('=') > -1) {

					var obj = {};

					obj.device = device;

					obj.type = 'rfxcom';

					obj.data = dec[n];

					obj.timestamp = common.getEpoch(); 

					point.update(obj, function() {

						loop(n + 1);

					});

				} else {

					loop(n + 1);

				}

			} else {

				return;
						
			}

		})(0);

	} else {

		console.log('undecoded: ' + hex);

	}

};

module.exports = {

	start: function(serial,callback) {

		device = serial;

		console.log('starting rfxcom: ' + device);

		connect(function(con) {

			if (con) {

				console.log('ok!');

				addConn(con);

				poll();

				callback(true);

			} else {

				callback(false);

				console.log('failed!');

			}

		});

	},

	setPoint: function(obj,callback) {

		var lib = require('./encode.js');
	
		var hex;

		var keys = [

			'point',
			'cmd',
			'socket'

		];

		var n = 0;

		for (var key in obj) {

			if (common.inArray(key,keys))

				n++;

		}

		if (n == keys.length) {

			var pnt = obj.point;

			var cmd = obj.cmd;

			var con = obj.socket;

			var type = lib.type(pnt);

			var types = lib.types();

			if (common.inArray(type,types)) {

				hex = lib[type](pnt,cmd);

				if (hex) {
			
					con.write(hex,'hex');

					callback(true);

					return;

				}

			}

		}

		callback(false);

	}

};