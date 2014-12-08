'use strict';

(function() {
	var chalk = require('chalk'),
		DDP = require('ddp'),
		five = require("johnny-five"),
		sprinkler = require('./sprinkler'),
		sprinklerDetails = require('./sprinklerDetails'),
		ddpClient = new DDP({
			host: 'sprinkler.meteor.com',
			port: 443
		}),
		board = new five.Board();
		// sprinklerOne = {
		// 	id: 'TS78C6pWKszenNGL9',
		// 	pin: 10,
		// 	led: null
		// },
		// sprinklerTwo = {
		// 	id: 'rKofMTAJRcRok8RuZ',
		// 	pin: 11,
		// 	led: null
		// },
		// sprinklerThree = {
		// 	id: '66QRMaEeZ5JW42jhE',
		// 	pin: 12,
		// 	led: null
		// };
	//
	// board.on("ready", function() {
	// 	// sprinklerOne.led = new five.Led(sprinklerOne.pin);
	// 	// sprinklerTwo.led = new five.Led(sprinklerTwo.pin);
	// 	// sprinklerThree.led = new five.Led(sprinklerThree.pin);
	// 	//ddpClient.connect(clientConnect);
	// 	ddpClient.connect(clientConnect);
	// });


	//TODO temp
	ddpClient.connect(clientConnect);

	function clientConnect(err, wasRecon) {
		if (err) {
			console.log(chalk.yellow('DDP connection error. Poos.'));
			return;
		}

		if (wasRecon) {
			console.log(chalk.yellow('DDP reconnection made.'));
		}

		ddpClient.call('getConnectionDetails', [],
			function (err, result) {
				if (err) {
					console.log(chalk.red('Error in getting connection details: ' + err));
					return;
				}
				console.log(chalk.green('Successfully got connection details'));
				sprinklerInit(result);
			},
			function () {
				console.log(chalk.yellow('Finished updating connection details'));
				sprinklerSubscribe();
			}
		);
	}

	function sprinklerInit(records) {
		console.log(chalk.yellow('Setting connection details'));
		return;
		sprinklerDetails.setDetails(records);
	}

	function sprinklerSubscribe() {
		console.log(chalk.yellow('Attempting DDP subscription'));
		sprinkler.subscribe(ddpClient, function() {
			console.log(chalk.green('DDP subsciption successful'));
			sprinkler.subscribeSprinklerChange(turnOnSprinkler, turnOffSprinkler);
			setInterval(function() {
				sprinkler.sanityCheck(ddpClient, turnOnSprinkler, turnOffSprinkler);
			}, 30000);

		});
	}

	function turnOnSprinkler(id) {
		var s = sprinklerDetails.get(id);

		if (!s) {
			return;
		}

		console.log(chalk.green('Turn on ' + s.name + ' on pin ' + s.pin));

		//s.led.on();
	}

	function turnOffSprinkler(id) {
		var s = sprinklerDetails.get(id);

		if (!s) {
			return;
		}

		console.log(chalk.magenta('Turn off ' + s.name + ' on pin ' + s.pin));

		//s.led.off();
	}
})();
