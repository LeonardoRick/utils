/**
 * Function to execute a new thread on the same file. This function wraps the send function
 * into a generated URL object so we can use this "file" as a param to create a worker.
 * Caution:
 * - The function must be not dependent of any global variable. Everything that it uses must
 *   be defined within it
 * - neither importScripts or module imports will work
 * - we can't retrieve anything that the wrapped function returns
 * for example of usage check the tests
 * @param {Function} func
 * @param {{ allowNonThreadExecution: Boolean, args: Array, type: ('classic'|'module') }} options
 * @returns {Worker} the spawned worker object;
 */
export function runOnWorker(
  func = function () {},
  { allowNonThreadExecution = false, args = [], type = 'module' } = {}
) {
  if (!window || !window.Worker) {
    if (!allowNonThreadExecution) {
      throw new Error('Worker API not found (window.Worker falsy)');
    }
    func();
  }

  const SYMBOL_IDENTIFIER = `________symbol`;

  const INPUT_PARSERS = {
    string: (arg) => `'${arg}'`,
    object: (arg) => JSON.stringify(arg),
    symbol: (arg) =>
      JSON.stringify({
        [SYMBOL_IDENTIFIER]: 'symbol',
        description: arg.description,
      }),
  };

  const _args = args.map((arg) => {
    const parser = INPUT_PARSERS[typeof arg];
    return parser ? parser(arg) : arg;
  });

  /**
   * this function is going to be stringified so it
   * should NOT have exernal dependencies
   * @param {Array} params
   * @returns the args the way we should send to function 'func'
   */
  function parseArgs(params) {
    const OUTPUT_PARSERS = {
      object: (arg) => {
        if (arg.hasOwnProperty([SYMBOL_IDENTIFIER])) {
          return Symbol(arg.description);
        }
        return arg;
      },
    };
    return params.map((param) => {
      const parser = OUTPUT_PARSERS[typeof param];
      return parser ? parser(param) : param;
    });
  }

  const workerFile = `
   const SYMBOL_IDENTIFIER = '${SYMBOL_IDENTIFIER}';
   const args = parseArgs([${_args}]);
   ${func.name}(...args);
   ${func.toString()}
   ${parseArgs.toString()}
 `;

  return new Worker(
    URL.createObjectURL(
      new Blob([workerFile], {
        type: 'application/javascript',
      })
    ),
    {
      type: type || 'module',
    }
  );
}
