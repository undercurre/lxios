import InterceptorManager from "./interceptorManager";
import { merge, mergeConfig, forEachDeep } from "./utils";

class Lxios {
  // 仅仅是保存传入的config,
  // 然后初始化空的拦截器对象
  public defaults: LxiosInstanceConfig;
  public interceptors: {
    request: any;
    response: any;
  };

  constructor(config: LxiosInstanceConfig) {
    this.defaults = config;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    };
  }

  // 允许直接传入对象或者字符串url+对象
  request(
    configOrUrl: string | LxiosInstanceConfig,
    config: LxiosInstanceConfig
  ) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    // 合并配置
    config = mergeConfig(this.defaults, config);

    const { headers } = config;

    // 默认get请求
    config.method = (
      config.method ||
      this.defaults.method ||
      "get"
    ).toLowerCase();

    let contextHeaders =
      headers && merge(headers[config.method], headers.common);

    headers &&
      forEachDeep(
        ["delete", "get", "head", "post", "put", "patch", "common"],
        (method) => {
          delete headers[method];
        }
      );

    // 优先使用headers下配置，再使用headers.common和headers[get,post]的配置
    config.headers = AxiosHeaders.concat(contextHeaders, headers);

    // 请求拦截器链
    const requestInterceptorChain = [];
    // 记录是否使用同步的方式调用，我们配置拦截器的时候，默认是false，也就是异步
    let synchronousRequestInterceptors = true;

    this.interceptors.request.forEach(function unshiftRequestInterceptors(
      interceptor
    ) {
      // 如果配置了runWhen函数，那么会先执行runWhen，如果为true，才会添加该拦截器
      if (
        typeof interceptor.runWhen === "function" &&
        interceptor.runWhen(config) === false
      ) {
        return;
      }
      synchronousRequestInterceptors =
        synchronousRequestInterceptors && interceptor.synchronous;
      // unshift说明后传入的请求拦截器先执行，一次放入两个，分别是fulfilled和rejected
      requestInterceptorChain.unshift(
        interceptor.fulfilled,
        interceptor.rejected
      );
    });

    // 响应拦截器链
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(
      interceptor
    ) {
      // push说明先传入的响应拦截器先执行
      responseInterceptorChain.push(
        interceptor.fulfilled,
        interceptor.rejected
      );
    });

    let promise;
    let i = 0;
    let len;

    // 默认是异步执行，也就是一个执行完再执行下一个
    if (!synchronousRequestInterceptors) {
      //dispatchRequest是真正的发送请求
      const chain = [dispatchRequest.bind(this), undefined];
      // 前面插入请求拦截器
      chain.unshift.apply(chain, requestInterceptorChain);
      // 后面插入响应拦截器
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;

      promise = Promise.resolve(config);
      // 依次执行
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }

      return promise;
    }

    len = requestInterceptorChain.length;

    let newConfig = config;

    i = 0;

    // 同步执行，请求拦截器
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }

    // 发起请求
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }

    i = 0;
    len = responseInterceptorChain.length;

    // 返回有异常可以继续走下去
    while (i < len) {
      promise = promise.then(
        responseInterceptorChain[i++],
        responseInterceptorChain[i++]
      );
    }

    return promise;
  }
}

export default Lxios;
