declare type LxiosInstanceConfig = {
  baseURL: string;
  url?: string;
  timeOut: number;
  headers: Record<string, any>;
  cancelToken: CancelToken | null;
  adapter: "xhr" | "http";
  params: Record<string, any>;
  [key: string]: any;
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
