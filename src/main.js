import { createApp } from "vue";
import pinia from "@/stores/pinia";
import router from "./router";
import i18n from "./i18n";
import App from "./App.vue";
import ElementPlus from "element-plus";
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import "@/assets/styles/var.scss"
import "@/assets/styles/global.scss"
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { useAppStore } from "@/stores/modules/app"

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(pinia);
app.use(router);
app.use(ElementPlus);
app.use(i18n);

const appStore = useAppStore()
i18n.global.locale.value = appStore.language
appStore.initTheme()

app.config.globalProperties.$t = i18n.global.t

app.mount("#app");

document.addEventListener('contextmenu', (e) => e.preventDefault())
