import adapters from "./adapters";

// 这个函数的作用就是用来判断请求是否被取消，
// 如果取消的话，则直接抛出异常，
function throwIfCancellationRequested(config: LxiosInstanceConfig) {
  config.cancelToken?.promise.then((reason) => {
    throw Error("请求被取消" + reason);
  });
}

// 发送请求核心函数
export default function dispatchRequest(config: LxiosInstanceConfig) {
  // 刚开始请求前判断一次是否已被取消
  throwIfCancellationRequested(config);

  // 默认设置请求头的contentType为application/x-www-form-urlencoded
  if (["post", "put", "patch"].indexOf(config.method) !== -1) {
    config.headers.setContentType("application/x-www-form-urlencoded", false);
  }

  // 获取适配器，如果是浏览器环境获取xhr，
  // 如果是Node环境，获取http
  // 适配器就是最终用来发送请求的东西
  const adapter = adapters[config.adapter];

  // 请求是使用适配器执行config
  return adapter(config).then(
    function onAdapterResolution(response: any) {
      // 请求完之后判断是否要取消
      throwIfCancellationRequested(config);
      return response;
    },
    function onAdapterRejection(reason: any) {
      return Promise.reject(reason);
    }
  );
}
