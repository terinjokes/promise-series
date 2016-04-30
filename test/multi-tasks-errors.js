import test from 'ava';
import Promise from 'core-js/library/es6/promise';
import isPromise from 'is-promise';
import sinon from 'sinon';
import PromiseSeries from '../';

test.beforeEach(t => {
  t.context.stub = sinon.stub().returns(Promise.resolve());
  t.context.series = new PromiseSeries();
  t.context.series.add(t.context.stub);
  t.context.series.add(t.context.stub);
  t.context.series.add(rejectPromise);
  t.context.series.add(t.context.stub);
  t.context.series.add(t.context.stub);
});

test('series returns a Promise', t => {
  const result = t.context.series.run();
  t.true(isPromise(result));
  t.true(result instanceof Promise);
  t.true(result.constructor === Promise);
  result.catch(noop);
});

test('series eventually is rejected', async t => {
  await t.throws(t.context.series.run(), 'from unit test');
});

test('series called stub only twice', async t => {
  await t.throws(t.context.series.run());

  t.true(t.context.stub.callCount === 2);
});

function rejectPromise() {
  return Promise.reject(new Error('from unit test'));
}

function noop() {
}
