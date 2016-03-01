logs = (function() {

	var names = function(callback) {

		var query = 'SELECT DISTINCT `log` FROM logs';

		SQL.query(query, function(data) {

			callback(data);

		});

	};

	var idRange = function(log,callback) {

		var query = 'SELECT `id` FROM logs WHERE `log`="' + log + '"';

		var arr;

		SQL.query(query, function(data) {

			if (data.error)

				return;

			arr = range(common.objVals(data.rows));

			callback(arr);

		});

	};

	var range = function(array) {

		var arr = [];

		var len = array.length;

		if (array.length > 0) {

			arr.push(array[0]);

			arr.push(array[len-1]);

			return arr;

		} else {

			return array;

		}

	};

	return {

		methods: function() {

			return [

				'GET',
				'DELETE'

			];

		},

		GET: function(req,res) {

			if (req.resource) {

				if (req.query) {

					if ((req.resource[0].log) && (req.query.id)) {

						var log = req.resource[0].log;

						var id = req.query.id.split('-');

						var query = 'SELECT * FROM logs WHERE `log`="' + log + '" AND `id` BETWEEN ' + id[0] + ' AND ' + id[1];

						SQL.query(query, function(data) {

							if (data.error)

								res.send(data.error);

							res.json(data.rows);

						});

					} else {

						res.send('Invalid request!');

					}

				} else {

					methods.GET(req,res);

				}

			} else {

				names(function(data) {

					if (data.error) {

						res.send(data.error);

					} else {

						var list = common.objVals(data.rows);

						var log;

						var logs = {};

						var len = list.length;

						(function loop(n) {

							if (n == len) {

								res.json(logs);

							} else {

								log = list[n];

								idRange(log, function(range) {

									logs[log] = range;

									loop(n + 1);

								});

							}

						})(0);

					}

				});

			}
	
		},

		DELETE: function(req,res) {

			methods.DELETE(req,res);

		}

	}

})();