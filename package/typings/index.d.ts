declare type LxiosRequestConfig = {
  url?: string;
  method?: Method;
  data?: any;
  params?: any;
  headers?: any;
  responseType?: XMLHttpRequestResponseType;
  timeout?: number;
  transformRequest?: LxiosTransformer | LxiosTransformer[];
  transformResponse?: LxiosTransformer | LxiosTransformer[];
  cancelToken?: CancelToken;
  [propName: string]: any;
};

declare interface Lxios {
  request<T = any>(config: LxiosRequestConfig): LxiosPromise<T>;

  get<T = any>(url: string, config?: LxiosRequestConfig): LxiosPromise<T>;

  delete<T = any>(url: string, config?: LxiosRequestConfig): LxiosPromise<T>;

  head<T = any>(url: string, config?: LxiosRequestConfig): LxiosPromise<T>;

  options<T = any>(url: string, config?: LxiosRequestConfig): LxiosPromise<T>;

  post<T = any>(
    url: string,
    data?: any,
    config?: LxiosRequestConfig
  ): LxiosPromise<T>;

  put<T = any>(
    url: string,
    data?: any,
    config?: LxiosRequestConfig
  ): LxiosPromise<T>;

  patch<T = any>(
    url: string,
    data?: any,
    config?: LxiosRequestConfig
  ): LxiosPromise<T>;
}

function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== "undefined" ? val2 : val1;
}

declare type XMLHttpRequestResponseType =
  | ""
  | "arraybuffer"
  | "blob"
  | "document"
  | "json"
  | "text";

declare type Method =
  | "get"
  | "GET"
  | "delete"
  | "Delete"
  | "head"
  | "HEAD"
  | "options"
  | "OPTIONS"
  | "post"
  | "POST"
  | "put"
  | "PUT"
  | "patch"
  | "PATCH";

declare var XMLHttpRequest: {
  new (): XMLHttpRequest;
  prototype: XMLHttpRequest;
};

declare interface LxiosResponse {
  data: any;
  status: number;
  statusText: string;
  headers: any;
  config: LxiosRequestConfig;
  request: any;
}

declare interface LxiosPromise extends Promise<LxiosResponse> {}

declare interface LxiosError extends Error {
  config: LxiosRequestConfig;
  code?: string;
  request?: any;
  response?: LxiosResponse;
  isLxiosError: boolean;
}

declare interface LxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number;

  eject(id: number): void;
}

declare interface ResolvedFn<T = any> {
  (val: T): T | Promise<T>;
}

declare interface RejectedFn {
  (error: any): any;
}

declare interface LxiosTransformer {
  (data: any, headers?: any): any;
}

declare interface LxiosInstance extends Lxios {
  <T = any>(config: LxiosRequestConfig): LxiosPromise<T>;
  <T = any>(url: string, config?: LxiosRequestConfig): LxiosPromise<T>;
}

declare interface LxiosStatic extends LxiosInstance {
  (config: LxiosRequestConfig): LxiosInstance;
  create(config?: LxiosRequestConfig): LxiosInstance;

  CancelToken: CancelTokenStatic;
  Cancel: CancelStatic;
  isCancel: (value: any) => boolean;
}

interface Cancel {
  message?: string;
}

declare interface CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;
  throwIfRequested(): void;
}

declare interface Canceler {
  (message?: string, config?: LxiosRequestConfig, request?: any): void;
}

declare interface CancelExecutor {
  (cancel: Canceler): void;
}

declare interface CancelTokenSource {
  token: CancelToken;
  cancel: Canceler;
}

declare interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken;

  source(): CancelTokenSource;
}

declare interface Cancel {
  message?: string;
}

declare interface CancelStatic {
  new (message?: string): Cancel;
}
