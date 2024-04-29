import Lxios from "./lxios";
import defaults from "./default";

function createInstance(defaultConfig: LxiosInstanceConfig) {
  // 新建实例
  const context = new Lxios(defaultConfig);
  // 如我们常用的axios('/api/url')
  // 实现方法：把实例变成函数
  const instance = Lxios.prototype.request.bind(context);
  // 绑定Axios的实例属性和实例方法axios.interceptors.request.use()
  Object.keys(context).forEach((key) => {
    // @ts-ignore
    if (typeof context[key] === "function") {
      // @ts-ignore
      instance[key] = context[key].bind(context);
    } else {
      // @ts-ignore
      instance[key] = context[key];
    }
  });

  return instance;
}

// 创建lxios实例
const lxios = createInstance(defaults);

export default lxios;
