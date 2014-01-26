'use strict';
var pending = {
		then: function() {
			return pending;
		}
	},
	Deque = require('double-ended-queue'),
	HybridMap = require('hybrid-map').HybridMap,
	privateMap = new HybridMap();

function PromiseSeries() {
	privateMap.set(this, {
		calls: new Deque()
	});
}

PromiseSeries.prototype.add = function(fn) {
	privateMap.get(this).calls.push(fn);
};

PromiseSeries.prototype.run = function() {
	var calls = privateMap.get(this).calls,
		call,
		previous;

	if (calls.isEmpty()) {
		return pending;
	}

	while (call = calls.shift()) {
		if (!previous) {
			previous = call();
			continue;
		}

		previous = previous.then(call);
	}

	return previous;
};

module.exports = PromiseSeries;

