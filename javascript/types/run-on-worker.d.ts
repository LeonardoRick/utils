export class InlineWorker<F extends Function> extends Worker {
  constructor(script: string | URL, options?: WorkerOptions);

  onMessage: (ev: MessageEvent) => any;
  onReturn: (value: ReturnType<F>) => any;
}

export function runOnWorker<F extends Function>(
  func: F,
  options?: { allowNonWorkerExecution: Boolean; args: Array<any>; type: 'classic' | 'module' }
): InlineWorker<F>;
