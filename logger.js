'use strict';

var loggerShim = (function() {
	var winston = require('winston'),
		logger = new (winston.Logger)({
			transports: [
				new (winston.transports.Console)(),
				new (winston.transports.File)({
					filename: 'logfile.log'
				})
			]
		});

	return {
		log: function(level, msg, config) {
			if (config) { // Can be cleaned up
				logger.log(level, msg, config);
			} else {
				logger.log(level, msg);
			}
		}
	};
})();

module.exports = loggerShim;
