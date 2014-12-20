/*
 * The sprinkler collection. Creates a connection with the mongo db via DDP and responsds
 * to appropriate change events.
 *
 * This collection is in charge of responding to collection change events and deciding
 * whether to fire an event to the consumer (app.js) or not. The only publicly available
 * function is `subscribe`
 */

'use strict';

var sprinkler = (function() {
	var DDP = require('ddp'),
		// Insert server details here. Defaults to http://localhost:3000
		ddpClient = new DDP({
			//	host: 'host details',
			//	port: 443
		}),
		logger = require('./logger'),
		sprinklerDetails = require('./sprinklerDetails'),
		Q = require('q'),
		EventEmitter = require('events').EventEmitter,
		eventEmitter = new EventEmitter(),
		observer;

	/*
	 * Get the initial details from the sprinkler collection. Once we have the details,
	 * make the subscription to all collection changes.
	 *
	 * @param {boolean} [err] Whether an error was thrown
	 * @param {boolean} [wasRecon] Whether this call was from a reconnection
	 */
	function initDetails(err, wasRecon) {
		if (err) {
			logger.log('error', 'DDP connection error.');
			return;
		}

		if (wasRecon) {
			logger.log('info', 'DDP reconnection made.');
		}

		logger.log('info', 'Getting initial sprinkler details.');
		ddpClient.call('getConnectionDetails', [], setDetails, subscribeToCollection);
	}

	/*
	 * Set the received details from `initDetails` for the sprinklerDetails module
	 *
	 * @param {boolean} [err] Whether an error was thrown
	 * @param {results} [array] The resulting sprinkler records to apply to sprinklerDetails
	 */
	function setDetails(err, results) {
		if (err) {
			logger.log('error', 'Error in getting connection details.', err);
			return;
		}

		logger.log('info', 'Successfully got connection details.');
		sprinklerDetails.setDetails(results);
	}

	/*
	 * Subscribe to the remote sprinkler collection.
	 */
	function subscribeToCollection() {
		logger.log('info', 'Finished updating connection details');

		ddpClient.subscribe('sprinklers', [], successfulCollectionSubscription);
	}

	/*
	 * Callback for successfully subscribing to the sprinkler collection.
	 *
	 * This function in turn creates an observer that gets fired every time a change
	 * is made on the collection. When a change is made, we decide here if we want
	 * to notify any observer about the change. The notification will only occur
	 * if it was a status change.
	 *
	 */
	function successfulCollectionSubscription() {
		logger.log('info', 'Subscribed to sprinkler collection.');
		observer = ddpClient.observe('sprinklers');

		// Regsiter changes on the collection
		observer.changed = function(id, oldFields, clearedFields, newFields) {
			logger.log('info', 'change');
			if (!newFields.status) {
				// No status field change so we don't care
				return;
			}

			// Has the status been altered? Sanity check
			var statusAltered = sprinklerDetails.statusAltered(id, newFields.status),
				detail;

			if (statusAltered) {
				// Yip, the status has been altered. Update our sprinklerDetails
				detail = sprinklerDetails.update(id, newFields);
				logger.log('info', [id, 'changed status from', oldFields.status, 'to', newFields.status].join(' '));

				// Notify the observer
				eventEmitter.emit('statusChange', detail);
			}
		};
	}

	return {
		/*
		 * Subscribe to the sprinkler collection
		 *
		 * @returns {promise}
		 */
		subscribe: function() {
			var deferred = Q.defer();
			ddpClient.connect(function() {
				logger.log('info', 'Connected to sprinklers');

				// Woo, connected! Resolve promise and return our event emitter.
				deferred.resolve(eventEmitter);

				// Now initialise all our sprinkler details etc.
				initDetails();
			});

			return deferred.promise;
		},

		/*
		* Subscribe to the sprinkler collection
		*
		* @returns {promise}
		*/
		sanityCheck: function() {
			logger.log('info', 'Sanity checking sprinkler status');

			var deferred = Q.defer();
			ddpClient.call('checkSprinklerStatus', [],
				function(err, results) {
					if (err) {
						logger.log('error', 'Error sanity checking details: ' + err);
						return;
					}

					results.forEach(function(s) {
						if (sprinklerDetails.statusAltered(s.id, s.status)) {
							logger.log('info', s.name + ' altered state in sanity check. Resolving');
							deferred.resolve(s);
						}
					});
				},
				function() {
					logger.log('info', 'Finished sanity checking details');
				}
			);

			return deferred.promise;
		}
	};
})();

module.exports = sprinkler;
