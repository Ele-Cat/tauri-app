import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore(
  "app",
  () => {
    const count = ref(0);
    const name = ref("Tauri App");

    const increment = () => {
      count.value++;
    };

    const setName = (newName) => {
      name.value = newName;
    };

    return {
      count,
      name,
      increment,
      setName,
    };
  },
  {
    persist: true,
  }
);
