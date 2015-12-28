'use strict';
/* globals describe, it, before */
var expect = require('assume');
expect.use(require('assume-sinon'));

var sinon = require('sinon');
var _Promise = require('core-js/library/es6/promise');
var PromiseSeries = require('../');
var isPromise = require('is-promise');

function addOne(count) {
  return _Promise.resolve(count ? count + 1 : 1);
}
function throwError() {
  return _Promise.reject(new Error('This is an error from the unit tests'));
}

describe('PromiseSeries', function () {
  it('should export a function', function () {
    expect(PromiseSeries).is.a('function');
  });

  it('should create an instance', function () {
    var series = new PromiseSeries();
    expect(series).is.instanceOf(PromiseSeries);
  });

  it('should have an add method', function () {
    var series = new PromiseSeries();
    expect(series.add).is.a('function');
  });

  it('should have a run method', function () {
    var series = new PromiseSeries();
    expect(series.run).is.a('function');
  });

  describe('No functions added', function () {
    var result;
    before(function () {
      var series = new PromiseSeries();
      result = series.run();
    });

    it('should return a promise', function () {
      expect(isPromise(result)).true();
    });

    it('should not be fulfilled', function (done) {
      this.timeout(3000);
      done = expect.wait(1, 0, done);

      result.then(function () {
        done(new Error('should not have been resolved'));
      }, done);

      setTimeout(done, 2000);
    });
  });

  describe('One function added', function () {
    var result;

    before(function () {
      var series = new PromiseSeries();
      series.add(addOne);
      result = series.run();
    });

    it('should return a promise', function () {
      expect(isPromise(result)).true();
    });

    it('should eventually be equal 1', function (done) {
      done = expect.wait(1, 1, done);

      result.then(function (value) {
        expect(value).equals(1);
        done();
      }, done);
    });

    describe('Error thrown', function () {
      var result;

      before(function () {
        var series = new PromiseSeries();
        series.add(throwError);
        result = series.run();
      });

      it('should return a promise', function () {
        expect(isPromise(result)).true();
      });

      it('should eventually be rejected', function (done) {
        done = expect.wait(1, 1, done);

        result.then(function () {
          done(new Error('should not have resolved'));
        }, function (err) {
          expect(err).is.a('error');
          done();
        });
      });
    });
  });

  describe('Multiple functions added', function () {
    var result;

    before(function () {
      var series = new PromiseSeries();
      series.add(addOne);
      series.add(addOne);
      series.add(addOne);
      series.add(addOne);
      series.add(addOne);
      result = series.run();
    });

    it('should return a promise', function () {
      expect(isPromise(result)).true();
    });

    it('should eventually be equal 5', function (done) {
      done = expect.wait(1, 1, done);

      result.then(function (value) {
        expect(value).equals(5);
        done();
      }, done);
    });

    describe('Error thrown', function () {
      var stub = sinon.stub().returns(_Promise.resolve());
      var result;

      before(function () {
        var series = new PromiseSeries();
        series.add(stub);
        series.add(stub);
        series.add(throwError);
        series.add(stub);
        series.add(stub);
        result = series.run();
      });

      it('should return a promise', function () {
        expect(isPromise(result)).true();
      });

      it('should eventually be rejected', function (done) {
        done = expect.wait(1, 1, done);

        result.then(function () {
          done(new Error('should not have resolved'));
        }, function (err) {
          expect(err).is.a('error');
          done();
        });
      });

      it('should ahve only counted the stub twice', function () {
        expect(stub).called(2);
      });
    });
  });
});

