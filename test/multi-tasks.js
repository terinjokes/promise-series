import test from 'ava';
import Promise from 'core-js/library/es6/promise';
import isPromise from 'is-promise';
import PromiseSeries from '../';

test.beforeEach(t => {
  t.context.series = new PromiseSeries();
  t.context.series.add(addOne);
  t.context.series.add(addOne);
  t.context.series.add(addOne);
  t.context.series.add(addOne);
  t.context.series.add(addOne);
});

test('series returns a Promise', t => {
  const result = t.context.series.run();
  t.true(isPromise(result));
  t.true(result instanceof Promise);
  t.true(result.constructor === Promise);
});

test('series eventually resolves to 5', async t => {
  const value = await t.context.series.run();
  t.true(value === 5);
});

function addOne(count) {
  return Promise.resolve(count ? count + 1 : 1);
}
