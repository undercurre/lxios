import dispatchRequest from "./dispatchRequest";
import InterceptorManager from "./interceptorManager";
import mergeConfig from "./helper/mergeConfig";

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

    // 默认get请求
    config.method = (
      config.method ||
      this.defaults.method ||
      "get"
    ).toLowerCase();

    // 请求拦截器链
    const requestInterceptorChain: Array<Interceptor> = [];

    this.interceptors.request.forEach((interceptor: Interceptor) => {
      requestInterceptorChain.unshift(interceptor);
    });

    // 响应拦截器链
    const responseInterceptorChain: Array<Interceptor> = [];
    this.interceptors.response.forEach((interceptor: Interceptor) => {
      responseInterceptorChain.push(interceptor);
    });

    let promise;
    let i;
    let len;

    i = 0;
    len = requestInterceptorChain.length;

    let newConfig = config;

    // 同步执行，请求拦截器
    while (i < len) {
      const curInterceptor = requestInterceptorChain[i++];
      try {
        if (curInterceptor.fulfilled)
          newConfig = curInterceptor.fulfilled(newConfig);
      } catch (error) {
        if (curInterceptor.rejected) curInterceptor.rejected.call(this, error);
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
        responseInterceptorChain[i++].fulfilled,
        responseInterceptorChain[i++].rejected
      );
    }

    return promise;
  }
}

export default Lxios;
