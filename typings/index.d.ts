declare type LxiosInstanceConfig = {
  url: string;
  method: string;
  data: Record<string, any>;
  params: Record<string, any>;
  adapter: any;
  transformRequest: Array<(data: any, headers: Record<string, any>) => any>;
  transformResponse: Array<() => any>;
  cancelToken: CancelToken | null;
  validateStatus: any;
};

type onFulfilled<V> = (value: V) => V | Promise<V>;

type onRejected = (error: any) => any;

declare type Interceptor = {
  fulfilled?: onFulfilled<V>;
  rejected?: onRejected;
};

declare interface LxiosRequestConfig {
  method: string;
  url: string;
  headers?: Record<string, string>;
  data?: any;
}

declare interface LxiosResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}
