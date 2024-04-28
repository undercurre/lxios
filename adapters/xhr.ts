import { buildFullUrl } from "../helper/path";

const xhrAdapter = (config: LxiosInstanceConfig): Promise<LxiosResponse> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      config.method.toUpperCase(),
      buildFullUrl(config.baseURL, config.url, config.params),
      true
    );
    xhr.onload = () => {
      const responseHeaders = xhr
        .getAllResponseHeaders()
        .split("\r\n")
        .reduce((acc, current) => {
          const [key, value] = current.split(": ");
          if (key) acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
      resolve({
        data: JSON.parse(xhr.responseText),
        status: xhr.status,
        statusText: xhr.statusText,
        headers: responseHeaders,
      });
    };
    xhr.onerror = () => reject(new Error("XHR request failed"));
    xhr.send(config.data);
  });
};

export default xhrAdapter;
