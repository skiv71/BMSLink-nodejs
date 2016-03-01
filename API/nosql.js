var getPath = function(query) {

	return __dirname + '/DB/' + query.collect;

};

var check = function(path,callback) {

	common.chkFs(path, function(ok) {

		if (ok) {

			callback();

		} else {

			common.mkDir(path, function(ok) {

				if (ok)

					callback();

			});

		}

	});

};

var json = function(query,callback) {

	var path = getPath(query);

	var fs = require('fs');

	var extend = require('extend');

	var arr = [];

	common.listFiles(path, function(files) {

		(function loop(n)  {

			if (n < files.length) {

				var obj = {};

				var json;

				obj.id = (n + 1).toString();

				obj.file = files[n];

				fs.readFile(path + '/' + obj.file,'utf8',function(err,data) {

					if (err) {

						console.log('file read error!');

					} else {

						try {

							json = JSON.parse(data);

						}

						catch(e) {

							json = {

								error: e

							};
						}

						extend(obj,json);

					}
				
					if (query.where) {

						if (where(obj,query))

							arr.push(obj);

					} else {

						arr.push(obj);

					}

					loop(n + 1);

				});

			} else {

				callback(arr);

				return;

			}

		})(0);

	});

};
	
var selectKeys = function(obj) {

	var arr = [];

	for (var key in obj) {

		if (!obj[key])

			arr.push(key);

	}

	return arr;

};

var select = function(data,query,callback) {

	var arr = [];

	var keys = selectKeys(query.select);

	for (var idx in data) {

		var obj = {};

		for (var key in data[idx]) {

				if (common.inArray(key,keys)) {

					obj[key] = data[idx][key];

				}

		}

		arr.push(obj);

	}

	callback(arr);
	
};

var where = function(obj,query) {

	var keys = 0;

	var match = 0;

	for (var key in query.where) {

		keys++;

  		if (common.isArray(query.where[key])) {

  			for (var j in query.where[key]) {

  				if (obj[key] == query.where[key][j])

  					match++;

	  		}

  		} else {

  			if (obj[key] == query.where[key])

  				match++;

  		}

  	}

  	if (keys == match)

  		return true;

  	return false;

};

module.exports = {

	read: function(query,callback) {

		json(query, function(data) {

			if (query.select) {

				select(data,query, function(values) {

					callback(values);

				});

			} else {

				callback(data);

			}

	  	});

	},

	insert: function(query,callback) {

		var path = getPath(query);

		var obj = {};

		var records = 0;

		check(path, function() {

			obj.file = path + '/' + common.getEpoch() + '.json';

			obj.data = JSON.stringify(query.insert);

			common.writeFile(obj, function(ok) {

				if (ok)

					records = 1;

				callback({inserted: records.toString()});
			
			});

		});

	},

	update: function(query,callback) {

		var path = getPath(query);

		var keys;

		var arr = [];

		var upd;

		if (query.select) {

			json(query, function(data) {

				upd = 0;

				for (var idx in data) {

					obj = data[idx];

					keys = common.objKeys(obj);

					for (var key in query.select) {

						if (common.inArray(key,keys)) {

							obj[key] = query.select[key];

							upd++

						}
						
					}

				}

				if (upd > 0)

					arr.push(obj);

				(function loop(n) {

					if (n < arr.length) {

						var file = path + '/' + arr[n].file;

						delete arr[n].id;

						delete arr[n].file;

						var str = JSON.stringify(arr[n]);

						var obj = {};

						obj.file = file;

						obj.data = str;

						common.writeFile(obj, function(){

							loop(n + 1);

						});

					} else {

						callback({updated: arr.length.toString()});

						return;

					}

				})(0);

			});

		}

	},

	remove: function(query,callback) {

		var path = getPath(query);

		var file;

		var obj;

		var arr = [];

		json(query, function(data) {

			for (var idx in data) {

				obj = data[idx];

				if (where(obj,query))

					arr.push(obj.file);

			}

			(function loop(n) {

			if (n < arr.length) {

				file = path + '/' + arr[n];

				common.delFs(file, function(){

					loop(n + 1);

				});

			} else {

				callback({deleted: arr.length.toString()});

				return;

			}

			})(0);

		});
		   	
	}

}