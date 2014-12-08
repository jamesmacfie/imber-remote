'use strict';

var _ = require('underscore'),
  chalk = require('chalk'),
  five = require("johnny-five"),
  connectionMap = {
    1: 10,
    2: 11,
    3: 12
  };

module.exports = {
  details: [],
  setDetails: function(records) {
    //Reset details
    this.details = [];

    records.forEach(function(record) {
      record.pin = connectionMap[record.connection];
      console.log(record.pin);
      record.led = new five.Led(record.pin);

      this.details.push(record);
    }, this);

    console.log(chalk.green('Init sprinkler details set'));

    return this.details;
  },
  updateDetail: function(id, fields) {

  },
  get: function(id) {
    return _(this.details).find(function(d) {
      return d.id === id;
    });
  }
}
