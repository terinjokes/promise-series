'use strict';
var pending = {
		then: function() {
			return pending;
		}
	},
	Deque = require('double-ended-queue'),
	HybridMap = require('hybrid-map').HybridMap,
	privateMap = new HybridMap();

function PromiseSeries(options) {
	options = options || {};
	options.mode = options.mode || 'reduce'; // or 'array'
	privateMap.set(this, {
		calls: new Deque(),
		results: [],
		mode: options.mode
	});
}

PromiseSeries.prototype.add = function(fn) {
	privateMap.get(this).calls.push(fn);
};

PromiseSeries.prototype.run = function() {
	var map = privateMap.get(this);
	var calls = map.calls,
		results = map.results,
		mode = map.mode,
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
		(function (_call) {
			previous = previous.then(function (result) {
				if (mode === 'array') results.push(result);
				return _call(result);
			});
		})(call);
	}

	return previous.then(function (result) {
		results.push(result);
		return mode === 'array' ? results : result;
	});
};

module.exports = PromiseSeries;
