<script setup>
import { useI18n } from "vue-i18n";
import { ref } from "vue";

const { t, locale } = useI18n();

const languageOptions = [
  { value: "zh-CN", label: "中文" },
  { value: "en", label: "English" },
];

const currentLanguage = ref(locale.value);

const switchLanguage = () => {
  locale.value = currentLanguage.value;
};
</script>

<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <h2>{{ t("about.title") }}</h2>
      </template>
      <div class="content">
        <p>{{ t("about.description") }}</p>
        <el-space direction="vertical" :size="16" style="margin-top: 20px; width: 100%">
          <el-card shadow="hover">
            <h3>{{ t("common.language") }}</h3>
            <el-select v-model="currentLanguage" @change="switchLanguage">
              <el-option
                v-for="item in languageOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-card>
        </el-space>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.content {
  padding: 10px 0;
}
</style>
