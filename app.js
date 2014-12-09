'use strict';

(function() {
	var five = require('johnny-five'),
		logger = require('./logger'),
		sprinkler = require('./sprinkler'),
		board;

	function init() {
		// board = new five.Board();
		// setupBoard(sprinklerSubscribe);
		sprinklerSubscribe();
	}

	function setupBoard(callback) {
		board.on('ready', function() {
			logger.log('info', 'Board ready');
			callback.call();
		});
	}

	function sprinklerSubscribe() {
		logger.log('info', 'Attempting to subscribe to the sprinklers');
		sprinkler.subscribe().then(bindEvents);
	}

	function bindEvents(s) {
		s.on('statusChange', function(sprinkler) {
			logger.log('info', 'Status change received', sprinkler.status);

			var startStatuses = ['active', 'resume'],
				stopStatuses = ['inactive', 'paused'];

			if (startStatuses.indexOf(sprinkler.status) !== -1) {
				turnOnSprinkler(sprinkler.pin);
			} else if (stopStatuses.indexOf(sprinkler.status) !== -1) {
				turnOffSprinkler(sprinkler.pin);
			}

		});
	}

	function turnOnSprinkler(pin) {
		logger.log('info', 'Turning on sprinkler');

		// var led = new five.Led(pin);
		// led.on();
	}

	function turnOffSprinkler(pin) {
		logger.log('info', 'Turning off sprinkler');

		// var led = new five.Led(pin);
		// led.off();
	}

	init();

})();
