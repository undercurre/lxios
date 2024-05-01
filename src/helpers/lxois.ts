import dispatchRequest from "./dispatchRequest";
import InterceptorManager from "./interceptorManager";

interface Interceptors {
  request: InterceptorManager<LxiosRequestConfig>;
  response: InterceptorManager<LxiosResponse>;
}

interface PromiseChain {
  resolved: ResolvedFn | ((config: LxiosRequestConfig) => LxiosPromise);
  rejected?: RejectedFn;
}

export default class Lxios {
  defaults: LxiosRequestConfig;
  interceptors: Interceptors;

  constructor(initConfig: LxiosRequestConfig) {
    this.defaults = initConfig;
    this.interceptors = {
      request: new InterceptorManager<LxiosRequestConfig>(),
      response: new InterceptorManager<LxiosResponse>(),
    };
  }

  request(url: any, config?: any): LxiosPromise {
    if (typeof url === "string") {
      if (!config) {
        config = {};
      }
      config.url = url;
    } else {
      config = url;
    }

    const chain: PromiseChain[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined,
      },
    ];

    this.interceptors.request.forEach((interceptor) => {
      chain.unshift(interceptor);
    });

    this.interceptors.response.forEach((interceptor) => {
      chain.push(interceptor);
    });

    let promise = Promise.resolve(config);

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!;
      promise = promise.then(resolved, rejected);
    }

    return promise;
  }
}
