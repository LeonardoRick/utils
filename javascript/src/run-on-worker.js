/**
 * identifier internally used to identify the symbol
 * on the hole stringify/unstrigify of params send to
 * the function that is going to run on the worker
 */
const SYMBOL_IDENTIFIER = `________symbol`;

/**
 * Parsers to stringifiy valeus as they where being
 * write on the editor, for example a string value xx
 * should be 'xx' (with quotation marks)
 */
const STRINGIFY = {
  string: (arg) => `'${arg}'`,
  object: (arg) => JSON.stringify(arg),
  symbol: (arg) =>
    JSON.stringify({
      [SYMBOL_IDENTIFIER]: 'symbol',
      description: arg.description,
    }),
};

/**
 * this function is going to be stringified
 * so it should NOT have exernal dependencies
 * @param {Array} params
 * @returns the args the way we should send
 * to function 'func'
 */
function parseArgs(params) {
  const UNSTRINGIFY = {
    object: (arg) => {
      if (arg.hasOwnProperty([SYMBOL_IDENTIFIER])) {
        return Symbol(arg.description);
      }
      return arg;
    },
  };
  return params.map((param) => {
    const parser = UNSTRINGIFY[typeof param];
    return parser ? parser(param) : param;
  });
}

/**
 * create JS as a string to send to Blob
 */
function getWorkerFIle(func, args) {
  const _args = args.map((arg) => {
    const parser = STRINGIFY[typeof arg];
    return parser ? parser(arg) : arg;
  });

  return `
         const SYMBOL_IDENTIFIER = '${SYMBOL_IDENTIFIER}';
         const args = parseArgs([${_args}]);
         ${parseArgs.toString()}
         const value = (${func.toString()})(...args)
         postMessage({_type: 'return', value })
       `;
}
// use window.Worker only if window is defined, otherwise extends an anonymous class.
// this is just to be able to import the class without errors, but understand that
// in a node environment, the runOnWorker function will not work!
const _Worker = typeof window !== 'undefined' ? Worker : class {};

/**
 * extends worker and add the following functionalities:
 * 1) add a onReturn event handler that can be implemented as onmessage
 *    which emits only events with _type = 'return'
 * 2) add a onMessage event handler that can be implemented as onmessage
 *    which emits only events WITHOUT _type = 'return'
 */
export class InlineWorker extends _Worker {
  constructor(scriptURL, options) {
    super(scriptURL, options);
    // set empty rerun value listner so we don't receive an
    // error when trying to run this function on handleReturnValue
    this.onReturn = () => {};
    this.onMessage = () => {};
    this.addEventListener('message', this.#handleMessage.bind(this));
  }

  /**
   * Handle only the postMessage that returns from
   * running the function that we sent to the worker
   * @param {MessageEvent} ev
   */
  #handleMessage(ev) {
    if (ev.data?._type === 'return') {
      this.onReturn(ev.data.value);
    } else {
      this.onMessage(ev);
    }
  }

  terminate() {
    this.removeEventListener('message', this.#handleMessage);
    super.terminate();
  }
}

/**
 * Function to execute a new thread on the same file. This function wraps the send function
 * into a generated URL object so we can use this "file" as a param to create a worker.
 * Caution:
 * - The function must be not dependent of any global variable. Everything that it uses must
 *   be defined within it
 * - neither importScripts or module imports will work
 *
 * Example: const worker = runOnWorker(() => console.log('BANANA'));
 * for more example of usage check the tests
 * @param {Function} func
 * @param {{ allowNonWorkerExecution: boolean, args: any[], type: ('classic'|'module') }} options
 * @returns {InlineWorker} the spawned InlineWorker object that extends browser Worker;
 */
export function runOnWorker(
  func = function () {},
  { allowNonWorkerExecution = false, args = [], type = 'module' } = {}
) {
  if (typeof window === 'undefined' || !window || !window.Worker) {
    if (!allowNonWorkerExecution) {
      throw new Error(
        'Worker API not found (window.Worker falsy and inline functions execution on another thread is currenlty not supported by node thread_workers)'
      );
    }
    func();
  }

  return new InlineWorker(
    URL.createObjectURL(
      new Blob([getWorkerFIle(func, args)], {
        type: 'application/javascript',
      })
    ),
    {
      type: type || 'module',
    }
  );
}
