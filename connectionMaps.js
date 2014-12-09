'use strict';

var connectionMap = {
	1: 10,
	2: 11,
	3: 12
};

module.exports = {
	getPin: function(conn) {
		return connectionMap[parseInt(conn)];
	}
};
