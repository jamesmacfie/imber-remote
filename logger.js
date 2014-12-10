/*
 * An abstraction over a logging module (currently Winston).
 */

'use strict';

var loggerShim = (function() {
	var winston = require('winston'),
		logger = new (winston.Logger)({
			// Create transports both for the console and a logfile
			transports: [
				new (winston.transports.Console)(),
				new (winston.transports.File)({
					filename: 'logfile.log'
				})
			]
		});

	return {
		/*
		 * Logs info to both the console and the log file mentioned above
		 *
		 * @param {string} [level] The level of importance of the message. I.e `debug`, `info`, `error`
		 * @param {string} [msg] The log description
		 * @param {object} [config] Any othe info you want associated with this log
		 */
		log: function(level, msg, config) {
			// Strangely, with Winston I'm finding I have to explicitly decide not to pass though
			// the `config` object, even it it's set as undefined. Weird...
			if (config) {
				logger.log(level, msg, config);
			} else {
				logger.log(level, msg);
			}
		}
	};
})();

module.exports = loggerShim;
