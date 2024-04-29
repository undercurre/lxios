import xhr from "./adapters/xhr";
import http from "./adapters/http";

/**
 * 获取适配器
 */
function getDefaultAdapter() {
  let adapter;
  if (typeof XMLHttpRequest !== "undefined") {
    // 浏览器端使用XMLHttpRequest
    adapter = xhr;
  } else if (
    typeof process !== "undefined" &&
    Object.prototype.toString.call(process) === "[object process]"
  ) {
    // node端使用http
    adapter = http;
  }

  return adapter;
}

const defaults: LxiosInstanceConfig = {
  // 适配器
  adapter: getDefaultAdapter(),
  transformRequest: [
    function transformRequest(data, headers) {
      headers["Accept"] = "application/json, text/plain, */*";

      if (!data) {
        return data;
      }

      // 根据header类型配置Content-type
      if (typeof data === "object") {
        headers["Content-Type"] = "application/json";
        return JSON.stringify(data);
      }

      return data;
    },
  ],
  url: "",
  method: "",
  data: {},
  params: {},
  transformResponse: [],
  cancelToken: null,
  validateStatus: undefined,
};

export default defaults;
