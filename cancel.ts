export class Cancel {
  message?: string;
  constructor(message?: string) {
    this.message = message;
  }
}

export function isCancel(value: any) {
  return value instanceof Cancel;
}

export class CancelToken {
  public resolve: any;
  source() {
    return {
      token: new Promise((resolve) => {
        this.resolve = resolve;
      }),
      cancel: (message: string) => {
        this.resolve(new Cancel(message));
      },
    };
  }
}
