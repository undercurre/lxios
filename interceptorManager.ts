class InterceptorManager<V> {
  // 构造函数只初始化了一个空的handlers数组
  public handlers: Array<Interceptor | null>;
  // 拦截器就是放在这个数组里的
  constructor() {
    this.handlers = [];
  }
  use(fulfilled?: onFulfilled<V>, rejected?: onRejected) {
    this.handlers.push({
      fulfilled,
      rejected,
    });
    return this.handlers.length - 1;
  }
  reject(id: number) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  // 清空拦截器
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
}

export default InterceptorManager;
