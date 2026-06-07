<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { fetchSeats, fetchSeatStatistics, fetchZoneSeatStatistics, updateSeatStatus } from "../api/client";
import { localSeats, localSeatStatistics, localZoneStatistics } from "../data/workbench";
import type { Seat, SeatZone, SeatStatus, SeatStatistics as ISeatStatistics, ZoneSeatStatistics } from "../types";
import { SeatStatusLabel, SeatZoneLabel } from "../types";
import SeatDetail from "./SeatDetail.vue";

const seats = ref<Seat[]>(localSeats);
const statistics = ref<ISeatStatistics>(localSeatStatistics);
const zoneStatistics = ref<ZoneSeatStatistics[]>(localZoneStatistics);
const selectedZone = ref<SeatZone | "ALL">("ALL");
const selectedSeat = ref<Seat | null>(null);
const showDetail = ref(false);
const notice = ref("正在加载实时机位数据...");
let refreshTimer: number | null = null;

const statusColor: Record<SeatStatus, string> = {
  AVAILABLE: "available",
  IN_USE: "in-use",
  FAULT: "fault",
  RESERVED: "reserved",
};

const filteredSeats = computed(() => {
  if (selectedZone.value === "ALL") {
    return seats.value;
  }
  return seats.value.filter((s) => s.zone === selectedZone.value);
});

const groupedSeats = computed(() => {
  const groups: Record<SeatZone, Seat[]> = {
    HALL: [],
    BOX: [],
    VIP: [],
  };
  filteredSeats.value.forEach((seat) => {
    groups[seat.zone].push(seat);
  });
  return groups;
});

const zones: { value: SeatZone | "ALL"; label: string }[] = [
  { value: "ALL", label: "全部区域" },
  { value: "HALL", label: "大厅" },
  { value: "BOX", label: "包厢" },
  { value: "VIP", label: "VIP区" },
];

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} 分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} 小时 ${mins} 分钟` : `${hours} 小时`;
}

function handleSeatClick(seat: Seat) {
  selectedSeat.value = seat;
  showDetail.value = true;
}

function handleCloseDetail() {
  showDetail.value = false;
  selectedSeat.value = null;
}

async function handleStatusChange(id: number, status: SeatStatus) {
  try {
    const updated = await updateSeatStatus(id, status);
    const index = seats.value.findIndex((s) => s.id === id);
    if (index !== -1) {
      seats.value[index] = updated;
    }
    await loadStatistics();
  } catch {
    const index = seats.value.findIndex((s) => s.id === id);
    if (index !== -1) {
      seats.value[index] = { ...seats.value[index], status };
    }
    await loadStatistics();
  }
}

async function loadSeats() {
  try {
    seats.value = await fetchSeats();
    notice.value = "实时更新中";
  } catch {
    notice.value = "使用本地演示数据";
  }
}

async function loadStatistics() {
  try {
    statistics.value = await fetchSeatStatistics();
    zoneStatistics.value = await fetchZoneSeatStatistics();
  } catch {
    statistics.value = localSeatStatistics;
    zoneStatistics.value = localZoneStatistics;
  }
}

async function refreshData() {
  await loadSeats();
  await loadStatistics();
}

onMounted(async () => {
  await refreshData();
  refreshTimer = window.setInterval(refreshData, 30000);
});

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
});
</script>

<template>
  <section class="seat-board">
    <div class="board-header">
      <div>
        <h2 class="board-title">机位实时看板</h2>
        <span class="pill">{{ notice }}</span>
      </div>
      <div class="zone-tabs">
        <button
          v-for="zone in zones"
          :key="zone.value"
          :class="['zone-tab', { active: selectedZone === zone.value }]"
          @click="selectedZone = zone.value"
        >
          {{ zone.label }}
        </button>
      </div>
    </div>

    <div class="stats-strip">
      <div class="stat-item primary">
        <span class="stat-label">上座率</span>
        <strong class="stat-value">{{ statistics.occupancyRate.toFixed(1) }}%</strong>
        <small>{{ statistics.inUseSeats }} / {{ statistics.totalSeats }} 台</small>
      </div>
      <div class="stat-item available">
        <span class="stat-label">空闲</span>
        <strong class="stat-value">{{ statistics.availableSeats }}</strong>
        <small>可立即上机</small>
      </div>
      <div class="stat-item in-use">
        <span class="stat-label">使用中</span>
        <strong class="stat-value">{{ statistics.inUseSeats }}</strong>
        <small>{{ statistics.availableSeats }} 台可上</small>
      </div>
      <div class="stat-item fault">
        <span class="stat-label">故障</span>
        <strong class="stat-value">{{ statistics.faultSeats }}</strong>
        <small>{{ statistics.faultSeats > 0 ? "需维修" : "全部正常" }}</small>
      </div>
      <div class="stat-item reserved">
        <span class="stat-label">预约</span>
        <strong class="stat-value">{{ statistics.reservedSeats }}</strong>
        <small>已预约待上机</small>
      </div>
    </div>

    <div v-if="selectedZone === 'ALL'" class="zone-sections">
      <section v-for="zoneStat in zoneStatistics" :key="zoneStat.zone" class="zone-section">
        <div class="zone-header">
          <h3>{{ zoneStat.zoneLabel }}</h3>
          <div class="zone-summary">
            <span>{{ zoneStat.availableSeats }} 空闲</span>
            <span>{{ zoneStat.inUseSeats }} 使用中</span>
            <span>{{ zoneStat.faultSeats }} 故障</span>
          </div>
        </div>
        <div class="seat-grid">
          <div
            v-for="seat in groupedSeats[zoneStat.zone]"
            :key="seat.id"
            :class="['seat-card', statusColor[seat.status]]"
            @click="handleSeatClick(seat)"
          >
            <div class="seat-code">{{ seat.seatCode }}</div>
            <div class="seat-status">{{ SeatStatusLabel[seat.status] }}</div>
            <div v-if="seat.memberName" class="seat-member">
              <span class="member-name">{{ seat.memberName }}</span>
              <span class="member-level">{{ seat.memberLevel }}</span>
            </div>
            <div v-if="seat.status === 'IN_USE' && seat.remainingMinutes > 0" class="seat-time">
              剩余 {{ formatDuration(seat.remainingMinutes) }}
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-else class="single-zone">
      <div class="seat-grid">
        <div
          v-for="seat in filteredSeats"
          :key="seat.id"
          :class="['seat-card', statusColor[seat.status]]"
          @click="handleSeatClick(seat)"
        >
          <div class="seat-code">{{ seat.seatCode }}</div>
          <div class="seat-status">{{ SeatStatusLabel[seat.status] }}</div>
          <div v-if="seat.memberName" class="seat-member">
            <span class="member-name">{{ seat.memberName }}</span>
            <span class="member-level">{{ seat.memberLevel }}</span>
          </div>
          <div v-if="seat.status === 'IN_USE' && seat.remainingMinutes > 0" class="seat-time">
            剩余 {{ formatDuration(seat.remainingMinutes) }}
          </div>
        </div>
      </div>
    </div>

    <SeatDetail
      v-if="showDetail && selectedSeat"
      :seat="selectedSeat"
      @close="handleCloseDetail"
      @status-change="handleStatusChange"
    />
  </section>
</template>

<style scoped>
.seat-board {
  margin-top: 26px;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.board-title {
  margin: 0 0 8px;
  font-size: clamp(20px, 2.5vw, 28px);
  font-weight: 800;
}

.zone-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.zone-tab {
  padding: 8px 16px;
  border: 1px solid color-mix(in srgb, #162423 15%, transparent);
  background: color-mix(in srgb, #f1f8f6 86%, white 14%);
  border-radius: 999px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.zone-tab:hover {
  background: color-mix(in srgb, #1b7f82 10%, transparent);
}

.zone-tab.active {
  background: #1b7f82;
  color: white;
  border-color: #1b7f82;
}

.stats-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.stat-item {
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid color-mix(in srgb, #162423 12%, transparent);
  background: color-mix(in srgb, #f1f8f6 86%, white 14%);
}

.stat-label {
  display: block;
  font-size: 13px;
  color: color-mix(in srgb, #162423 60%, transparent);
  margin-bottom: 6px;
}

.stat-value {
  display: block;
  font-size: clamp(22px, 2.5vw, 28px);
  font-weight: 800;
  line-height: 1.2;
}

.stat-item small {
  display: block;
  font-size: 12px;
  color: color-mix(in srgb, #162423 50%, transparent);
  margin-top: 4px;
}

.stat-item.primary .stat-value {
  color: #1b7f82;
}

.stat-item.available .stat-value {
  color: #22c55e;
}

.stat-item.in-use .stat-value {
  color: #f59e0b;
}

.stat-item.fault .stat-value {
  color: #ef4444;
}

.stat-item.reserved .stat-value {
  color: #8b5cf6;
}

.zone-section {
  margin-bottom: 28px;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, #162423 12%, transparent);
  background: color-mix(in srgb, #f1f8f6 86%, white 14%);
}

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.zone-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.zone-summary {
  display: flex;
  gap: 16px;
  font-size: 13px;
}

.zone-summary span {
  padding: 4px 10px;
  border-radius: 6px;
  background: color-mix(in srgb, #1b7f82 10%, transparent);
  font-weight: 600;
}

.seat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
}

.seat-card {
  padding: 14px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  border: 2px solid transparent;
}

.seat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px color-mix(in srgb, #162423 15%, transparent);
}

.seat-card.available {
  background: color-mix(in srgb, #22c55e 12%, transparent);
  border-color: color-mix(in srgb, #22c55e 30%, transparent);
}

.seat-card.in-use {
  background: color-mix(in srgb, #f59e0b 12%, transparent);
  border-color: color-mix(in srgb, #f59e0b 30%, transparent);
}

.seat-card.fault {
  background: color-mix(in srgb, #ef4444 12%, transparent);
  border-color: color-mix(in srgb, #ef4444 30%, transparent);
}

.seat-card.reserved {
  background: color-mix(in srgb, #8b5cf6 12%, transparent);
  border-color: color-mix(in srgb, #8b5cf6 30%, transparent);
}

.seat-code {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 4px;
}

.seat-status {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  opacity: 0.8;
}

.seat-member {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed color-mix(in srgb, #162423 20%, transparent);
}

.member-name {
  display: block;
  font-size: 13px;
  font-weight: 600;
}

.member-level {
  display: block;
  font-size: 11px;
  opacity: 0.7;
  margin-top: 2px;
}

.seat-time {
  margin-top: 6px;
  font-size: 11px;
  font-weight: 600;
  color: color-mix(in srgb, #162423 70%, transparent);
}

@media (max-width: 600px) {
  .board-header {
    flex-direction: column;
  }

  .seat-grid {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .zone-summary {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
