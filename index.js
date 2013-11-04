'use strict';
var pending = {
	then: function() {
		return pending;
	}
};

function PromiseSeries() {
	this._calls = [];
}

PromiseSeries.prototype.add = function(fn) {
	this._calls.push(fn);
};

PromiseSeries.prototype.run = function() {
	var length = this._calls.length,
		index,
		previous;

	if (!length) {
		return pending;
	}

	previous = this._calls[0]();
	for (index = 1; index < length; index++) {
		previous = previous.then(this._calls[index]);
	}

	return previous;
};

module.exports = PromiseSeries;

