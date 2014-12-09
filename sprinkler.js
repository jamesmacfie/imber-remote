'use strict';

var sprinkler = (function() {
	var DDP = require('ddp'),
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

	function initDetails(err, wasRecon) {
		if (err) {
			logger.log('error', 'DDP connection error.');
			return;
		}

		if (wasRecon) {
			logger.log('info', 'DDP reconnection made.');
		}

		logger.log('info', 'Getting initial sprinkler details.');
		ddpClient.call('getConnectionDetails', [], setDetails, subscribeToCollectionChanges);
	}

	function setDetails(err, results) {
		if (err) {
			logger.log('error', 'Error in getting connection details.', err);
			return;
		}

		logger.log('info', 'Successfully got connection details.');

		sprinklerDetails.setDetails(results);
	}

	function subscribeToCollectionChanges() {
		logger.log('info', 'Finished updating connection details');

		ddpClient.subscribe('sprinklers', [], successfulCollectionSubscription);
	}

	function successfulCollectionSubscription() {
		logger.log('info', 'Subscribed to sprinkler collection.');
		observer = ddpClient.observe('sprinklers');

		observer.changed = function(id, oldFields, clearedFields, newFields) {
			if (!newFields.status) {
				return;
			}

			var statusAltered = sprinklerDetails.statusAltered(id, newFields.status),
				detail;

			if (statusAltered) {
				detail = sprinklerDetails.update(id, newFields);
				logger.log('info', [id, 'changed status from', oldFields.status, 'to', newFields.status].join(' '));

				eventEmitter.emit('statusChange', detail);
			}
		};
	}

	return {
		subscribe: function() {
			var deferred = Q.defer();
			ddpClient.connect(function() {
				logger.log('info', 'Connected to sprinklers');

				deferred.resolve(eventEmitter);

				initDetails();
			});

			return deferred.promise;
		}
	};
})();

module.exports = sprinkler;
