/*
 * A simple mapping between the generic values set on Meteor sprinkler app and
 * the physical pins on the arduino
 */

'use strict';

var connectionMap = {
	1: 10,
	2: 11,
	3: 12
};

module.exports = {
	/*
	 * Returns the physical pin number given the connection value set via Meteor
	 *
	 * @param {number} [conn] The connection value via the Meteor app
	 *
	 * @returns {number} The physical pin number
	 */
	getPin: function(conn) {
		return connectionMap[parseInt(conn)];
	}
};
