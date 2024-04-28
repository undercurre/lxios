class CancelToken {
  subscribe(onCanceled: any) {
    throw new Error("Method not implemented.");
  }
  private cancelAction: ((reason: string) => void) | null = null;
  public promise: Promise<string>;
  // promise是为了能够做取消后处理

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
      // 把取消消息发布
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
// 触发构造实例，然后实例中的executor被执行，也就是cancel = c被执行，执行者被抛到source形成的闭包形成快捷调用方式

// 取消操作示例，通过用户操作或超时来取消请求
// setTimeout(() => {
//   cancel("Request canceled due to timeout");
// }, 5000); // 5秒后取消请求

// 取消请求的示例
// 取消处理需要调用promise使用then去处理
// token.promise.then((reason) => {
//   console.log("Request canceled:", reason);
// });

// 可以在需要时调用 cancel 函数来取消请求
// cancel("Request canceled by user");
