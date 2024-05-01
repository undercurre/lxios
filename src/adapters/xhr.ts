import { createError } from "../helpers/error";
import { parseHeaders } from "../helpers/headers";

export default function xhr(config: LxiosRequestConfig): LxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = "get",
      headers,
      responseType,
      timeout,
      cancelToken,
    } = config;

    const request = new XMLHttpRequest();

    if (timeout) {
      request.timeout = timeout;
    }

    if (cancelToken) {
      cancelToken.promise.then((reason) => {
        request.abort();
        reject(reason);
      });
    }

    request.ontimeout = function handleTimeout() {
      reject(
        createError(
          `Timeout of ${config.timeout} ms exceeded`,
          config,
          "ECONNABORTED",
          request
        )
      );
    };

    if (responseType) {
      request.responseType = responseType;
    }

    request.open(method.toUpperCase(), url, true);

    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 0) {
        return;
      }

      const responseHeaders = parseHeaders(request.getAllResponseHeaders());

      const responseData =
        responseType && responseType !== "text"
          ? request.response
          : request.responseText;
      const response: LxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request,
      };
      handleResponse(response);
    };

    function handleResponse(response: LxiosResponse) {
      if (response.status >= 200 && response.status < 300) {
        resolve(response);
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        );
      }
    }

    Object.keys(headers).forEach((name) => {
      if (data === null && name.toLowerCase() === "content-type") {
        delete headers[name];
      } else {
        request.setRequestHeader(name, headers[name]);
      }
    });

    request.onerror = function handleError() {
      reject(createError("Network Error", config, null, request));
    };

    request.send(data);
  });
}
