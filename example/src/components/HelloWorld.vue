<script setup lang="ts">
import { onMounted, ref } from "vue";
import lxios from "lxios";

defineProps<{ msg: string }>();

onMounted(() => {
  // 发起 GET 请求
  lxios
    .get("https://jsonplaceholder.typicode.com/posts")
    .then((response: any) => {
      // 请求成功，处理响应数据
      console.log("Lxios Response data:", response.data);
    })
    .catch((error: any) => {
      // 请求失败，处理错误信息
      console.error("Error:", error);
    });
});

const count = ref(0);
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
