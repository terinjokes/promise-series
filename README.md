# Promise Series

[![Greenkeeper badge](https://badges.greenkeeper.io/terinjokes/promise-series.svg)](https://greenkeeper.io/)

This `promise-series` modules allows you to queue promise-returning functions to execute in series, chaining values and errors down the line, and returning a final promise.

```javascript
var series = new PromiseSeries();
series.add(promiseForFile);
series.add(promiseForSearch);
series.add(promiseForWrite);
series.run().then(function() {
	console.log('All done!');
});
```

This promise utility module has no hard dependencies on any promise implementation, instead relying on the one returned by your functions. Care should be taken to ensure your functions always return promises, even in error.
