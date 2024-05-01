import xhr from "../adapters/xhr";
import { transform, transformRequest, transformResponse } from "./data";
import { flattenHeaders, processHeaders } from "./headers";
import { bulidURL } from "./url";

function dispatchRequest(config: LxiosRequestConfig): LxiosPromise {
  throwIfCancellationRequested(config);
  processConfig(config);
  return xhr(config).then((res) => {
    return transformResponseData(res);
  });
}

function processConfig(config: LxiosRequestConfig): void {
  config.url = transformUrl(config);
  config.headers = flattenHeaders(config.headers, config.method!);
  config.data = transform(config.data, config.headers, config.transformRequest);
}

function transformUrl(config: LxiosRequestConfig): string {
  const { url, params } = config;
  return bulidURL(url!, params);
}

function transformRequestData(config: LxiosRequestConfig): any {
  return transformRequest(config.data);
}

function transformHeaders(config: LxiosRequestConfig) {
  const { headers = {}, data } = config;
  return processHeaders(headers, data);
}

function transformResponseData(res: LxiosResponse): LxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse);
  return res;
}

function throwIfCancellationRequested(config: LxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

export default dispatchRequest;
