import { runOnWorker } from '../utils/run-on-worker';

describe('runOnWorker', () => {
  it('should send a function to a worker and receive back returned value', (done) => {
    function test() {
      return 'running on another thread' + 10;
    }
    const worker = runOnWorker(test);
    worker.onReturn = (value) => {
      expect(value).toEqual('running on another thread10');
      done();
    };
  });

  it('shoud be able to run arroow anonymous functions', (done) => {
    const worker = runOnWorker(() => 'BANANA');
    worker.onReturn = (value) => {
      expect(value).toEqual('BANANA');
      done();
    };
  });

  it('should activate onReturn callback only with the funciton returned value, not postMessage', (done) => {
    const worker = runOnWorker(() => {
      postMessage({ anotherValue: '20' });
      return { value: '10' };
    });
    worker.onMessage = (ev) => {
      expect(ev.data.anotherValue).toEqual('20');
    };
    worker.onReturn = (value) => {
      expect(value.value).toEqual('10');
      done();
    };
  });

  it('should be able to pass params to the function', (done) => {
    const worker = runOnWorker(
      (param) => {
        return param;
      },
      { args: ['my param'] }
    );

    worker.onReturn = (value) => {
      expect(value).toEqual('my param');
      done();
    };
  });

  it('should be able to pass objects as args', (done) => {
    const worker = runOnWorker(
      (param) => {
        return param;
      },
      { args: [{ property: 'propValue' }] }
    );
    worker.onReturn = (value) => {
      expect(value.property).toEqual('propValue');
      done();
    };
  });
  it('should be able to send symbols as args', (done) => {
    const worker = runOnWorker(
      (symbol) => {
        return symbol;
      },
      { args: [Symbol('mySymbol')] }
    );
    worker.onReturn = (value) => {
      expect(value.description).toEqual(Symbol('mySymbol').description);
      done();
    };
  });
});
