import { runOnWorker } from '../utils/run-on-worker';

describe('runOnWorker', () => {
  it('should do something', (done) => {
    function test() {
      console.log('Im running on another thread');
      postMessage(10);
    }
    const worker = runOnWorker(test);
    worker.onmessage = (e) => {
      expect(e.data).toEqual(10);
      done();
    };
  });
});
