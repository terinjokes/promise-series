import test from 'ava';
import PromiseSeries from '../';

test.beforeEach(t => {
  t.context.series = new PromiseSeries();
});

test('throws an Error', t => {
  t.throws(() => {
    t.context.series.run();
  }, 'PromiseSeries is empty');
});
