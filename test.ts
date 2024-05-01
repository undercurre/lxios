import axios from "axios";
// import lxios from "./src/index";

// 发起 GET 请求
axios
  .get("https://jsonplaceholder.typicode.com/posts")
  .then((response: any) => {
    // 请求成功，处理响应数据
    console.log("Axios Response data:", response.data);
  })
  .catch((error: any) => {
    // 请求失败，处理错误信息
    console.error("Error:", error.message);
  });

// lxios({
//   url: "https://jsonplaceholder.typicode.com/posts",
// })
//   .then((response: any) => {
//     // 请求成功，处理响应数据
//     console.log("Lxios Response data:", response.data);
//   })
//   .catch((error: any) => {
//     // 请求失败，处理错误信息
//     console.error("Error:", error.message);
//   });
