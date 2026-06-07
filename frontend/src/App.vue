<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { fetchOverview } from "./api/client";
import { APP_CODE, APP_NAME } from "./constants/app";
import { REQUEST_MESSAGES } from "./constants/messages";
import { createFallbackOverview } from "./state/dashboard";
import { routes } from "./routes";
import type { OverviewResponse } from "./types";
import FeatureStrip from "./components/FeatureStrip.vue";
import MetricGrid from "./components/MetricGrid.vue";
import OperationsTable from "./components/OperationsTable.vue";
import SeatBoard from "./components/SeatBoard.vue";

const currentPath = ref(window.location.hash.slice(1) || "/");
const overview = ref<OverviewResponse>(createFallbackOverview());
const notice = ref(REQUEST_MESSAGES.overviewFallback);

function goHealth() {
  window.location.href = REQUEST_MESSAGES.healthPath;
}

function navigate(path: string) {
  window.location.hash = path;
  currentPath.value = path;
}

async function loadOverview() {
  try {
    overview.value = await fetchOverview();
    notice.value = "后端服务已联通，当前展示实时接口数据。";
  } catch {
    notice.value = REQUEST_MESSAGES.overviewFallback;
  }
}

onMounted(async () => {
  await loadOverview();
  window.addEventListener("hashchange", () => {
    currentPath.value = window.location.hash.slice(1) || "/";
  });
});

watch(currentPath, async (newPath) => {
  if (newPath === "/") {
    await loadOverview();
  }
});
</script>

<template>
  <main class="app-shell">
    <header class="topbar">
      <div>
        <span class="brand-code">{{ APP_CODE }}</span>
        <h1 class="brand-title">{{ APP_NAME }}</h1>
      </div>
      <div class="topbar-actions">
        <nav class="nav-menu">
          <a
            v-for="route in routes"
            :key="route.path"
            :class="['nav-link', { active: currentPath === route.path }]"
            @click.prevent="navigate(route.path)"
            :href="'#' + route.path"
          >
            {{ route.label }}
          </a>
        </nav>
        <van-button type="primary" size="small" @click="goHealth">API Health</van-button>
      </div>
    </header>
    <section class="workspace">
      <template v-if="currentPath === '/'">
        <div class="lead-grid">
          <article class="hero-panel">
            <span class="pill">{{ notice }}</span>
            <h2>{{ overview.appName }}</h2>
            <p>{{ overview.description }}</p>
          </article>
          <MetricGrid :items="overview.kpis" />
        </div>
        <FeatureStrip :items="overview.features" />
        <section class="work-panel">
          <h2>运营任务流</h2>
          <OperationsTable :records="overview.records" />
        </section>
      </template>

      <template v-else-if="currentPath === '/seat-board'">
        <SeatBoard />
      </template>

      <template v-else>
        <section class="work-panel">
          <h2>{{ routes.find((r) => r.path === currentPath)?.label || "页面" }}</h2>
          <p class="placeholder-text">该功能正在开发中，敬请期待。</p>
        </section>
      </template>
    </section>
  </main>
</template>

<style scoped>
.topbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-menu {
  display: flex;
  gap: 4px;
}

.nav-link {
  padding: 8px 14px;
  border-radius: 8px;
  text-decoration: none;
  color: color-mix(in srgb, #162423 70%, transparent);
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: color-mix(in srgb, #1b7f82 10%, transparent);
  color: #162423;
}

.nav-link.active {
  background: #1b7f82;
  color: white;
}

.placeholder-text {
  color: color-mix(in srgb, #162423 50%, transparent);
  text-align: center;
  padding: 40px 0;
}

@media (max-width: 860px) {
  .topbar-actions {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .nav-menu {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 4px;
  }
}
</style>
