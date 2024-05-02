import Cancel from "./Cancel";

export default class CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;

  constructor(executor: CancelExecutor) {
    let resolvePromise: (value: Cancel | PromiseLike<Cancel>) => void;

    this.promise = new Promise<Cancel>((resolve) => {
      resolvePromise = resolve;
    });

    executor((message = "Canceled!") => {
      if (this.reason) {
        return;
      }
      this.reason = new Cancel(message);
      resolvePromise(this.reason);
    });
  }

  throwIfRequested(): void {
    if (this.reason) {
      throw this.reason;
    }
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler;
    const token = new CancelToken((c) => {
      cancel = c;
    });
    return {
      cancel,
      token,
    };
  }
}
