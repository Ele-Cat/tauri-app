<script setup>
import { useI18n } from "vue-i18n";
import { useAppStore } from "@/stores/app";
import { RouterLink } from "vue-router";

const { t } = useI18n();
const appStore = useAppStore();
</script>

<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <h2>{{ t("home.title") }}</h2>
      </template>
      <div class="content">
        <p>{{ t("home.welcome") }}</p>
        <el-space direction="vertical" :size="16" style="margin-top: 20px; width: 100%">
          <el-card shadow="hover">
            <h3>{{ t("home.count") }}: {{ appStore.count }}</h3>
            <el-button type="primary" @click="appStore.increment">
              {{ t("home.increment") }}
            </el-button>
          </el-card>
          <el-card shadow="hover">
            <p>Name: {{ appStore.name }}</p>
            <el-button @click="appStore.setName('New Name')">Change Name</el-button>
          </el-card>
          <el-card shadow="hover">
            <el-space>
              <RouterLink to="/about">
                <el-button type="info">{{ t("about.title") }}</el-button>
              </RouterLink>
            </el-space>
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
