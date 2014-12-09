'use strict';

var _ = require('underscore'),
	logger = require('./logger'),
	connectionMap = require('./connectionMaps'),
	details = [];

module.exports = {
	setDetails: function(records) {
		//Reset details
		details = [];

		records.forEach(function(record) {
			record.pin = connectionMap.getPin(record.connection);

			details.push(record);
		}, this);

		logger.log('info', 'Init sprinkler details set');
	},
	get: function(id) {
		return _(details).find(function(d) {
			return d.id === id;
		});
	},
	update: function(id, fields) {
		logger.log('info', 'Updating ' + id, fields);
		var detail  = this.get(id);
		detail = _.extend(detail, fields);

		return detail;
	},
	statusAltered: function(id, status) {
		var detail = this.get(id);
		if (!detail) {
			logger.log('error', 'The sprinkler with an ID of ' + id + ' was not found');
			return false;
		}

		if (detail.status !== status) {
			return true;
		}

		return false;
	}
};
