// import defaults from "../default";

// /**
//  * 数据转换
//  * @param data 请求数据
//  * @param headers 请求头
//  * @param fns 转换方法集合
//  * @return {*}
//  */
// export default function transformData(this: any, data: any, headers: any, fns: any[]) {
//   const context = this || defaults;

//   fns.forEach((fn: { call: (arg0: any, arg1: any, arg2: any) => any; }) => {
//     data = fn.call(context, data, headers);
//   });

//   return data;
// }
