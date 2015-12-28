'use strict';
var pending = {
  then: function () {
    return pending;
  }
};
var Deque = require('double-ended-queue');
var WeakMap = require('core-js/library/es6/weak-map');
var privateMap = new WeakMap();

function PromiseSeries() {
  privateMap.set(this, {
    calls: new Deque()
  });
}

PromiseSeries.prototype.add = function (fn) {
  privateMap.get(this).calls.push(fn);
};

PromiseSeries.prototype.run = function () {
  var calls = privateMap.get(this).calls;
  var call;
  var previous;

  if (calls.isEmpty()) {
    return pending;
  }

  while ((call = calls.shift())) {
    if (!previous) {
      previous = call();
      continue;
    }

    previous = previous.then(call);
  }

  return previous;
};

module.exports = PromiseSeries;

