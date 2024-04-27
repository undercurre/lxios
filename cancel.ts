class CancelToken {
  private cancelAction: ((reason: string) => void) | null = null;
  public promise: Promise<string>;

  constructor(executor: (cancel: (reason: string) => void) => void) {
    if (typeof executor !== "function") {
      throw new TypeError("Executor must be a function.");
    }

    this.promise = new Promise<string>((resolve) => {
      this.cancelAction = resolve;
    });

    executor((reason: string) => {
      if (this.cancelAction) {
        this.cancelAction(reason);
      }
    });
  }

  cancel(reason: string = "Operation canceled by the user"): void {
    if (this.cancelAction) {
      this.cancelAction(reason);
    }
  }

  static source(): { token: CancelToken; cancel: (reason: string) => void } {
    let cancel!: (reason: string) => void;
    const token = new CancelToken((c) => {
      cancel = c;
    });
    return {
      token,
      cancel,
    };
  }
}

// 示例用法
// const { token, cancel } = CancelToken.source();

// // 取消操作示例，通过用户操作或超时来取消请求
// setTimeout(() => {
//   cancel("Request canceled due to timeout");
// }, 5000); // 5秒后取消请求

// // 取消请求的示例
// token.promise.then((reason) => {
//   console.log("Request canceled:", reason);
// });

// // 可以在需要时调用 cancel 函数来取消请求
// cancel("Request canceled by user");
