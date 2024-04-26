// 这样引入的时候就可以直接得到实例
// 这其实是一个单例模式

function createInstance(): LxiosInstance | void {
  return {} as LxiosInstance;
}

let lxios = createInstance();

export default lxios;
