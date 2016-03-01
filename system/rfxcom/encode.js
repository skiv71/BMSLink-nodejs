var rfx = function(str) {

	return str.substr(2,4);

};

module.exports = {

	type: function(point) {

		return point.substr(1,5);

	},

	types: function() {

		var arr = [];

		arr.push('x1400');

		return arr;

	},

	x1400: function(str,val) {

		var len = '0A';

		val = parseInt(val.split('.').join(''));

		var id = str.substr(7).split(':').join('');

		var lev;

		var hex;

		if (val < 0 )

				cmd = '00';

		if ((val >= 1) && (val <= 100)) {

			cmd = '10';

			lev = Math.round(val * 0.31).toString(16);

		} else {

			lev = '00';

			if ((val >= 101) && (val <= 109))

				cmd = '01';

			if (val == 110)

				cmd = '0A';

			if (val == 111)

				cmd = '0B';

			if (val == 113)

				cmd = '0D';

			if (val == 114)

				cmd = '0E';

			if (val == 115)

				cmd = '0F';

		}

		hex = rfx(str) + '00' + id + cmd + lev + '60';

		if (hex.length == (parseInt(len,16) * 2)) {

			hex = len + hex;

			return hex.toUpperCase();

		}

	}

}