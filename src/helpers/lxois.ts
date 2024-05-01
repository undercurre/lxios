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

  request(
    configOrUrl: string | LxiosRequestConfig,
    config?: LxiosRequestConfig
  ): LxiosPromise {
    if (typeof configOrUrl === "string") {
      if (config) config.url = configOrUrl;
      config = {} as LxiosRequestConfig;
    } else {
      config = configOrUrl;
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
