var fs = require('fs');

var date = new Date();

module.exports = {

	isEven: function(n) {

		if (n & 1)

			return false;

		return true;

	},

	listFiles: function(path,callback) {

		var files = fs.readdirSync(path);

			callback(files);

	},

	chkFs: function(path,callback) {

		fs.stat(path, function(err) {

			if (err) {

				callback(false);

			} else {

				callback(true);

			}

		});

	},

	readFile: function(file,callback) {

		if (callback) {

			var arr = [];

			var rl = require('readline');

			var stream = rl.createInterface({

				input: fs.createReadStream(file)

			});

			callback(stream);

		}

	},

	mkDir: function(path,callback) {

		fs.mkdir(path, function(err) {

			if (err) {

				callback(false);

			} else {

				callback(true);

			}

		});

	},

	writeFile: function(obj,callback) {

		fs.writeFile(obj.file,obj.data,function(err) {

			if (err) {

				callback(false);
				
			} else {

				callback(true);

			}


		});

	},

	delFs: function(path,callback) {

		fs.unlink(path, function(err) {

			if (err) {

				callback(false);

			} else {

				callback(true);

			}

		});

	},

	inArray: function(term,array) {

		if (array.indexOf(term) > -1)

			return true;

		return false;

	},

	objKeys: function(obj) {

		var arr = [];

		for (var key in obj) {

			arr.push(key);

		}

		return arr;

	},

	objVals: function(obj) {

		var arr = [];

		for (var key in obj) {

			arr.push(obj[key]);

		}

		return arr;

	},

	isArray: function(obj) {

		var util = require('util');

		if (util.isArray(obj))

			return true;

		return false;

	},

	getEpoch: function() {

		return date.getTime();

	},

	resolveHost: function(host,callback) {

		var dns = require('dns');

		dns.resolve(host, function(err,ips) {

			if (err) {

				callback();

			} else {

				callback(ips);

			}

		});

	},

	connect: function(host,port,callback) {

		this.resolveHost(host, function(ip) {

			if (ip) {

				var net = require('net');

				var con = new net.Socket();

				con.connect(port,host,function() {

					callback(con);
			
				});

				con.on('error', function(err) {

					callback();

					if (con.socket)

						con.socket.end();

				});

			}

		});

	}

}