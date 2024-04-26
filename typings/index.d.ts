declare type LxiosInstanceConfig = {
  baseURL: string;
  url?: string;
  timeOut: number;
  headers: Record<string, any>;
  [key: string]: any;
};

declare type LxiosRequestConfig = {};

declare type LxiosResponse = {};

type onFulfilled<V> = (value: V) => V | Promise<V>;

type onRejected = (error: any) => any;

declare type Interceptor = {
  fulfilled?: onFulfilled<V>;
  rejected?: onRejected;
};
