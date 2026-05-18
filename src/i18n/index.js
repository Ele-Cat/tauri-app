import { createI18n } from "vue-i18n";
import zhCN from "./locales/zh-CN.js";
import en from "./locales/en.js";

const i18n = createI18n({
  legacy: false,
  locale: "zh-CN",
  fallbackLocale: "en",
  messages: {
    "zh-CN": zhCN,
    en,
  },
});

export default i18n;
