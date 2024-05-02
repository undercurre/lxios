import { isPlainObject } from "./util";

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data);
  }
  return data;
}

export function transformResponse(data: any): any {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      // do nothing
    }
  }
  return data;
}

export function transform(
  data: any,
  headers: any,
  fns?: LxiosTransformer | LxiosTransformer[]
): any {
  if (!fns) {
    return data;
  }
  if (!Array.isArray(fns)) {
    fns = [fns];
  }
  fns.forEach((fn) => {
    data = fn(data, headers);
  });
  return data;
}
