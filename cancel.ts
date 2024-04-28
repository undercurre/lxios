class CancelToken {
  subscribe(onCanceled: any) {
    throw new Error("Method not implemented.");
  }
  private cancelAction: ((reason: string) => void) | null = null;
  // 操作被取消后，任何依赖于 CancelToken.promise 的处理逻辑都可以通过 .then() 或 .catch() 处理这个取消事件和提供的取消原因。
  public promise: Promise<string>;
  // promise是为了能够做取消后处理

  // 当 CancelToken 被实例化时，构造函数接收一个执行器函数，执行器函数接收一个取消函数（我们的 cancel）作为参数。
  constructor(executor: (cancel: (reason: string) => void) => void) {
    if (typeof executor !== "function") {
      throw new TypeError("Executor must be a function.");
    }
    // 这会触发与 CancelToken 关联的 Promise 被解决（resolve），其值就是传递的取消原因。
    this.promise = new Promise<string>((resolve) => {
      this.cancelAction = resolve;
    });

    // 在执行器函数内部，该取消函数被赋值给 this.cancelAction，这样它就可以在外部被调用。
    executor((reason: string) => {
      if (this.cancelAction) {
        this.cancelAction(reason);
      }
      // 把取消消息发布
    });
  }

  // 提供了一个默认的取消原因，这增加了使用的便利性，允许调用者在不指定具体原因的情况下快速取消操作。
  // 如果 this.cancelAction 已被设置（也就是说，CancelToken 已经被正确初始化），则执行这个函数，并传递取消原因。
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
