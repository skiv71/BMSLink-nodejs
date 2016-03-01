var dev = function(hex) {

	return '0x' + hex.substr(2,4);

};

var multiple = function(id,val) {

	var arr = [];

	for (var idx in val) {

		arr.push(id + ':' + (parseInt(idx) + 1) + '=' + val[idx]);

	}

	return arr;

};

module.exports = {

	type: function(hex) {

		return 'x' + hex.substr(2,2);

	},

	types: function() {

		arr = [];

		arr.push('x02');

		arr.push('x50');

		arr.push('x54');

		return arr;

	},

	x02: function(hex) {

		var dec = [];

		var subtype = hex.substr(4,2);

		var msg = hex.substr(8,2);

		if (subtype == '00')

			dec.push('transmit,ERROR[msg-ignored]');

		if (subtype == '01') {

			if (msg == '00')

				dec.push('transmit,OK');

			if (msg == '01')

				dec.push('transmit,OK[delay-send]');

			if (msg == '02')

				dec.push('transmit,ERROR[no-lock]');

			if (msg == '03')

				dec.push('transmit,ERROR[id-error]');

		}

		return dec;

	},

	x50: function(hex) {

		var dec = [];

		var id = dev(hex) + ':' + hex.substr(8,4);

		var val = parseInt(hex.substr(12,4),'16');

		if (val > 32767)

			val = 32767 - val;

		val = val/10;

		val = val.toFixed(1);

		dec.push(id + '=' + val);

		return dec;

	},

	x54: function(hex) {

		var id = dev(hex) + ':' + hex.substr(8,4);

		var val = [];

		val.push(parseInt(hex.substr(12,4),'16'));

		if (val[0] > 32767)

			val[0] = 32767 - val[0];

		val[0] = val[0] / 10;

		val[0] = val[0].toFixed(1);

		val.push(parseInt(hex.substr(16,2),'16'));

		val.push(parseInt(hex.substr(20,4),'16'));

		return multiple(id,val);

	}

};