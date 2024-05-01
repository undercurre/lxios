export class LxiosError extends Error {
  isLxiosError: boolean;
  config: LxiosRequestConfig;
  code?: string | null;
  request?: any;
  response?: LxiosResponse;

  constructor(
    message: string,
    config: LxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: LxiosResponse
  ) {
    super(message);

    this.config = config;
    this.code = code;
    this.request = request;
    this.response = response;
    this.isLxiosError = true;

    Object.setPrototypeOf(this, LxiosError.prototype);
  }
}

export function createError(
  message: string,
  config: LxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: LxiosResponse
): LxiosError {
  const error = new LxiosError(message, config, code, request, response);

  return error;
}
