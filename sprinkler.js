'use strict';

var chalk = require('chalk'),
  collectionName = 'sprinklers',
  observer;

var sprinkler = {
  subscribe: function(ddp, fn) {
    var s = this;
    ddp.subscribe(collectionName, [], function() {
      console.log(chalk.green('Subscibed to ' + collectionName));
      observer = ddp.observe(collectionName);
      s.subscribeSprinklerChange();
      fn();
    });
  },
  subscribeSprinklerChange: function(onFn, offFn) {
    observer.changed = function(id, oldFields, clearedFields, newFields) {
      var startStatuses = ['active', 'resume'],
        stopStatuses = ['inactive', 'paused'];

      if (startStatuses.indexOf(newFields.status) !== -1) {
        onFn(id);
      } else if (stopStatuses.indexOf(newFields.status) !== -1) {
        offFn(id);
      }
    };
  },
  sanityCheck: function(ddp, onFn, offFn) {
	console.log(chalk.yellow('Sanity checking sprinkler status'));
	ddp.call('checkSprinklerStatus', [],
		function(err, results) {
			if (err) {
				console.log(chalk.red('Error sanity checking details: ' + err));
				return;
			}
			console.log(chalk.green('Received sanity check details'));

			results.forEach(function(s) {
				if (s.status === 'active') {
					console.log(chalk.yellow(['Sprinkler', s.name, 'set to active. Ensure it is on'].join(' ')));
					onFn(s.id);
				} else {
					console.log(chalk.yellow(['Sprinkler', s.name, 'set to', s.status, '. Ensure it is off'].join(' ')));
					offFn(s.id);
				}
			});
		},
		function() {
			console.log(chalk.yellow('Finished sanity checking details'));
		}
	);
  }
};

module.exports = sprinkler;
