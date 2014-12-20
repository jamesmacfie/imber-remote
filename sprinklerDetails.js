/*
 * Keeps track of the current state of each sprinkler.
 */

'use strict';

var _ = require('underscore'),
	logger = require('./logger'),
	connectionMap = require('./connectionMaps'),
	details = [];

module.exports = {

	/*
	 * Sets up the intial state of all our sprinklers.
	 *
	 * @param {array} [records] An array of sprinklers
	 */
	setDetails: function(records) {
		//Reset details
		details = [];

		// For each sprinkler, map the connection to the physical pin.
		records.forEach(function(record) {
			record.pin = connectionMap.getPin(record.connection);

			details.push(record);
		}, this);

		logger.log('info', 'Init sprinkler details set');
	},

	/*
	 * Returns an indidual sprinkler via it's ID
	 *
	 * @param {string} [id] The ID of the sprinkler in the collection
	 *
	 * @returns {object} The sprinkler
	 */
	get: function(id) {
		return _(details).find(function(d) {
			return d.id === id;
		});
	},

	/*
	 * Updates a sprinkler and returns the updated record
	 *
	 * @param {string} [id] The ID of the sprinkler in the collection
	 * @param {object} [fields] The fields that are to be updated
	 *
	 * @returns {object} The updated sprinkler
	 */
	update: function(id, fields) {
		logger.log('info', 'Updating ' + id, fields);
		var detail  = this.get(id);
		detail = _.extend(detail, fields);

		return detail;
	},

	/*
	 * Whether or not a sprinklers status has changed given a status string
	 *
	 * @param {string} [id] The ID of the sprinkler in the collection
	 * @param {string} [status] The status to check against
	 *
	 * @returns {boolean}
	 */
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
