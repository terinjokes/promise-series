'use strict';
var pending = {
		then: function() {
			return pending;
		}
	},
	Deque = require('double-ended-queue');

function PromiseSeries() {
	this._calls = new Deque();
}

PromiseSeries.prototype.add = function(fn) {
	this._calls.push(fn);
};

PromiseSeries.prototype.run = function() {
	var call,
		previous;

	if (this._calls.isEmpty()) {
		return pending;
	}

	while (call = this._calls.shift()) {
		if (!previous) {
			previous = call();
			continue;
		}

		previous = previous.then(call);
	}

	return previous;
};

module.exports = PromiseSeries;

