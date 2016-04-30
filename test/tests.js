import test from 'ava';
import PromiseSeries from '../';

test('exports a constructor', t => {
  t.true(typeof PromiseSeries === 'function');
});

test('creates a new instance', t => {
  let series = new PromiseSeries();
  t.true(series instanceof PromiseSeries);
  t.true(series.constructor === PromiseSeries);
});
