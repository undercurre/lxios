import * as http from "http";
import { URL } from "url";

const httpAdapter = (config: LxiosInstanceConfig): Promise<LxiosResponse> => {
  return new Promise((resolve, reject) => {
    const url = new URL(config.url);
    const options: http.RequestOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: config.method.toUpperCase(),
      headers: config.headers,
    };
    const req = http.request(options, (res: any) => {
      let data = "";
      res.on("data", (chunk: string) => (data += chunk));
      res.on("end", () => {
        resolve({
          data: JSON.parse(data),
          status: res.statusCode || 200,
          statusText: res.statusMessage || "OK",
          headers: res.headers as Record<string, string>,
        });
      });
    });
    req.on("error", (error: any) => reject(error));
    req.write(config.data);
    req.end();
  });
};

export default httpAdapter;
