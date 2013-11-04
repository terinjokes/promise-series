'use strict';
/* globals describe, it, before */
var chai = require('chai'),
	expect = chai.expect,
	chaiAsPromised = require('chai-as-promised'),
	sinon = require('sinon'),
	sinonChai = require('sinon-chai'),
	Q = require('q'),
	PromiseSeries = require('../'),
	addOne = Q.fbind(function(count) {
		return count ? count + 1 : 1;
	}),
	throwError = Q.fbind(function() {
		throw new Error('This is an error from the unit tests');
	});

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('PromiseSeries', function() {
	it('should export a function', function() {
		expect(PromiseSeries).to.be.a('function');
	});

	it('should create an instance', function() {
		var series = new PromiseSeries();
		expect(series).to.be.an.instanceof(PromiseSeries);
	});

	it('should have an add method', function() {
		var series = new PromiseSeries();
		expect(series).to.have.property('add');
	});

	it('should have a run method', function() {
		var series = new PromiseSeries();
		expect(series).to.have.property('run');
	});

	describe('No functions added', function() {
		var result;
		before(function() {
			var series = new PromiseSeries();
			result = series.run();
		});

		it('should return a promise', function() {
			expect(result).to.have.property('then').that.is.a('function');
		});

		it('should not be fulfilled', function(done) {
			this.timeout(3000);
			expect(result).to.not.be.eventually.fulfilled.and.notify(done);
			setTimeout(done, 2000);
		});
	});

	describe('One function added', function() {
		var result;

		before(function() {
			var series = new PromiseSeries();
			series.add(addOne);
			result = series.run();
		});

		it('should return a promise', function() {
			expect(result).to.have.property('then').that.is.a('function');
		});

		it('should eventually be equal 1', function(done) {
			expect(result).to.eventually.equal(1).and.notify(done);
		});

		describe('Error thrown', function() {
			var result;

			before(function() {
				var series = new PromiseSeries();
				series.add(throwError);
				result = series.run();
			});

			it('should return a promise', function() {
				expect(result).to.have.property('then').that.is.a('function');
			});

			it('should eventually be rejected', function(done) {
				expect(result).to.eventually.be.rejectedWith(Error).and.notify(done);
			});
		});
	});

	describe('Multiple functions added', function() {
		var result;

		before(function() {
			var series = new PromiseSeries();
			series.add(addOne);
			series.add(addOne);
			series.add(addOne);
			series.add(addOne);
			series.add(addOne);
			result = series.run();
		});

		it('should return a promise', function() {
			expect(result).to.have.property('then').that.is.a('function');
		});

		it('should eventually be equal 5', function(done) {
			expect(result).to.eventually.equal(5).and.notify(done);
		});

		describe('Error thrown', function() {
			var stub = sinon.stub().returns(Q.resolve()),
				result;

			before(function() {
				var series = new PromiseSeries();
				series.add(stub);
				series.add(stub);
				series.add(throwError);
				series.add(stub);
				series.add(stub);
				result = series.run();
			});

			it('should return a promise', function() {
				expect(result).to.have.property('then').that.is.a('function');
			});

			it('should eventually be rejected', function(done) {
				expect(result).to.eventually.be.rejectedWith(Error).and.notify(done);
			});

			it('should ahve only counted the stub twice', function() {
				/* jshint expr:true */
				expect(stub).to.have.been.calledTwice;
			});
		});
	});
});

