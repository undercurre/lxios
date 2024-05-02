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

    let promise = Promise.resolve(config) as LxiosPromise;

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!;
      promise = promise.then(resolved, rejected) as LxiosPromise;
    }

    return promise;
  }

  get(url: string, config?: LxiosRequestConfig): LxiosPromise {
    return this._requestMethodWithoutData("get", url, config);
  }

  delete(url: string, config?: LxiosRequestConfig): LxiosPromise {
    return this._requestMethodWithoutData("delete", url, config);
  }

  head(url: string, config?: LxiosRequestConfig): LxiosPromise {
    return this._requestMethodWithoutData("head", url, config);
  }

  options(url: string, config?: LxiosRequestConfig): LxiosPromise {
    return this._requestMethodWithoutData("options", url, config);
  }

  post(url: string, data?: any, config?: LxiosRequestConfig): LxiosPromise {
    return this._requestMethodWithData("post", url, data, config);
  }

  put(url: string, data?: any, config?: LxiosRequestConfig): LxiosPromise {
    return this._requestMethodWithData("put", url, data, config);
  }

  patch(url: string, data?: any, config?: LxiosRequestConfig): LxiosPromise {
    return this._requestMethodWithData("patch", url, data, config);
  }

  _requestMethodWithoutData(
    method: Method,
    url: string,
    config?: LxiosRequestConfig
  ) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
      })
    );
  }

  _requestMethodWithData(
    method: Method,
    url: string,
    data?: any,
    config?: LxiosRequestConfig
  ) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data,
      })
    );
  }
}
