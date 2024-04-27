// 这个函数的作用就是用来判断请求是否被取消，
// 如果取消的话，则直接抛出异常，
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    throw new Error("request canceled");
  }
}

// 发送请求核心函数
export default function dispatchRequest(config) {
  // 刚开始请求前判断一次是否取消
  throwIfCancellationRequested(config);

  config.headers = AxiosHeaders.from(config.headers);

  // 执行数据转换操作
  config.data = transformData.call(config, config.transformRequest);

  // 默认设置请求头的contentType为application/x-www-form-urlencoded
  if (["post", "put", "patch"].indexOf(config.method) !== -1) {
    config.headers.setContentType("application/x-www-form-urlencoded", false);
  }

  // 获取适配器，如果是浏览器环境获取xhr，
  // 如果是Node环境，获取http
  // 适配器就是最终用来发送请求的东西
  const adapter = adapters.getAdapter(config.adapter || defaults.adapter);

  // 请求是使用适配器执行config
  return adapter(config).then(
    function onAdapterResolution(response) {
      // 请求完之后判断是否要取消
      throwIfCancellationRequested(config);

      // 对返回结果进行转换
      response.data = transformData.call(
        config,
        config.transformResponse,
        response
      );

      // 设置返回头
      response.headers = AxiosHeaders.from(response.headers);

      return response;
    },
    function onAdapterRejection(reason) {
      // 如果不是因为取消而报错
      if (!isCancel(reason)) {
        // 再次判断是否要取消，如果是会抛出异常
        throwIfCancellationRequested(config);

        // 处理正常错误的返回值
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            config.transformResponse,
            reason.response
          );
          reason.response.headers = AxiosHeaders.from(reason.response.headers);
        }
      }

      return Promise.reject(reason);
    }
  );
}
