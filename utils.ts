export function mergeConfig(
  config1: LxiosInstanceConfig,
  config2: LxiosInstanceConfig
): LxiosInstanceConfig {
  // 创建一个空对象，用于存储合并后的配置
  const mergedConfig: LxiosInstanceConfig = {} as LxiosInstanceConfig;

  // 遍历默认配置（config2）中的所有属性，并将其复制到合并后的配置对象中
  for (const key in config2) {
    key as keyof LxiosInstanceConfig;
    mergedConfig[key] = config2[key];
  }

  // 遍历传入的配置（config1）中的所有属性
  for (const key in config1) {
    // 如果传入的配置中的属性在默认配置中已经存在，则覆盖默认配置中的值
    if (!config2.hasOwnProperty(key)) {
      key as keyof LxiosInstanceConfig;
      mergedConfig[key] = config1[key];
    }
  }

  // 返回合并后的配置对象
  return mergedConfig;
}

export function merge(
  config1: Record<string, any>,
  config2: Record<string, any>
): Record<string, any> {
  // 创建一个空对象，用于存储合并后的配置
  const mergedConfig: Record<string, any> = {};

  // 遍历默认配置（config2）中的所有属性，并将其复制到合并后的配置对象中
  for (const key in config2) {
    key as keyof LxiosInstanceConfig;
    mergedConfig[key] = config2[key];
  }

  // 遍历传入的配置（config1）中的所有属性
  for (const key in config1) {
    // 如果传入的配置中的属性在默认配置中已经存在，则覆盖默认配置中的值
    if (!config2.hasOwnProperty(key)) {
      key as keyof LxiosInstanceConfig;
      mergedConfig[key] = config1[key];
    }
  }

  // 返回合并后的配置对象
  return mergedConfig;
}

/**
这个函数是一个通用的迭代器函数，用于遍历数组或对象，并对每个元素执行指定的回调函数。
 */
export function forEach<T>(
  obj: T | T[],
  fn: (value: T, keyOrIndex: keyof T | string | number, obj: T | T[]) => void,
  options: { allOwnKeys?: boolean } = {}
): void {
  // 不处理未提供值的情况
  if (obj === null || typeof obj === "undefined") {
    return;
  }

  // 如果 obj 不是对象或数组，则将其转换为数组
  const iterable = Array.isArray(obj) ? obj : [obj];

  // 迭代器函数
  const iterate = (value: T, keyOrIndex: keyof T | string | number) => {
    fn(value, keyOrIndex, obj);
  };

  if (Array.isArray(iterable)) {
    // 迭代数组
    iterable.forEach((value, index) => {
      iterate(value, index);
    });
  } else {
    // 迭代对象
    const keys = options.allOwnKeys
      ? Object.getOwnPropertyNames(iterable)
      : Object.keys(iterable);

    keys.forEach((key) => {
      iterate(iterable[key], key);
    });
  }
}
