/*
 * The main entry point for the sprinkler controller. This file listens for event changes
 * on a sprinkler collection and turns on or off certain Arduino pins depending on what is
 * needed.
 *
 * It has no knowledge of the inner workings of the sprinklers apart form a defined set of
 * status's that determine the on/off switch.
 */

'use strict';

(function() {
	var five = require('johnny-five'),
		logger = require('./logger'),
		sprinkler = require('./sprinkler'),
		board;

	/*
	 * Intialise the app. Starts by creating the johnny-five board and then listening
	 * for sprinkler colletion events.
	 */
	function init() {
	//	board = new five.Board();
	//	board.on('ready', function() {
			logger.log('info', 'Board ready');
			sprinklerSubscribe();
	//	});
	}

	/*
	 * Subscribe to the sprinkler collection
	 */
	function sprinklerSubscribe() {
		logger.log('info', 'Attempting to subscribe to the sprinklers');
		sprinkler.subscribe().then(function() {
			logger.log('info', 'Bind events and start sanity check');
			sanityCheck();
			bindEvents();
		});
	}

	/*
	 * If we have successfully subscribed to the sprinkler colletion the bind our events
	 * to any changes in status. Makes the assumption that the pub/sub implementation that
	 * the colletion returns has an `on` method.
	 *
	 * @params {objet} [s] The sprinkler event emitter
	 */
	function bindEvents(s) {
		logger.log('info', 'Binding status change event');
		s.on('statusChange', statusChangeHandler);
	}

	/*
	 * Deals with any changes in any sprinkler status.
	 *
	 * @params {objet} [sprinkler] The sprinkler
	 */
	function statusChangeHandler(sprinkler) {
		logger.log('info', 'Status change received', sprinkler.status);

		// Which status's start a particular sprinkler and which status's stop it
		var startStatuses = ['active', 'resume'],
		stopStatuses = ['inactive', 'paused'];

		if (startStatuses.indexOf(sprinkler.status) !== -1) {
			turnOnSprinkler(sprinkler.pin);
		} else if (stopStatuses.indexOf(sprinkler.status) !== -1) {
			turnOffSprinkler(sprinkler.pin);
		}
	}

	/*
	 * Repeats a sanity check on the sprinkler status' every 30 seconds. This is incase
	 * our observer misses a change in sprinkler status.
	 */
	function sanityCheck() {
		logger.log('info', 'Init sanity check');
		setInterval(function() {
			sprinkler.sanityCheck().then(statusChangeHandler);
		}, 30000);
	}

	/*
	 * Turns on a given sprinkler/johnny-five pin. Currently uses the LED functionality
	 * because ...meh. I should change this to something a little more generic
	 *
	 * @params {nombre} [pin] The pin number on the johnny-five to turn on
	 */
	function turnOnSprinkler(pin) {
		logger.log('info', 'Turning on sprinkler');

		var led = new five.Led(pin);
		led.on();
	}

	/*
	* Turns off a given sprinkler/johnny-five pin. Currently uses the LED functionality
	* because ...meh. I should change this to something a little more generic
	*
	* @params {nombre} [pin] The pin number on the johnny-five to turn off
	*/
	function turnOffSprinkler(pin) {
		logger.log('info', 'Turning off sprinkler');

		var led = new five.Led(pin);
		led.off();
	}

	init();

})();
