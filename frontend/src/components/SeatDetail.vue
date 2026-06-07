<script setup lang="ts">
import { computed } from "vue";
import type { Seat, SeatStatus } from "../types";
import { SeatStatusLabel, SeatZoneLabel } from "../types";

const props = defineProps<{
  seat: Seat;
}>();

const emit = defineEmits<{
  close: [];
  statusChange: [id: number, status: SeatStatus];
}>();

const statusColor: Record<SeatStatus, string> = {
  AVAILABLE: "available",
  IN_USE: "in-use",
  FAULT: "fault",
  RESERVED: "reserved",
};

const availableStatuses: { value: SeatStatus; label: string }[] = [
  { value: "AVAILABLE", label: "设为空闲" },
  { value: "IN_USE", label: "开始使用" },
  { value: "FAULT", label: "标记故障" },
  { value: "RESERVED", label: "设为预约" },
];

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} 分钟`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} 小时 ${mins} 分钟` : `${hours} 小时`;
}

function formatDateTime(isoString?: string): string {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function calculateUsedTime(startTime?: string): string {
  if (!startTime) return "-";
  const start = new Date(startTime).getTime();
  const now = Date.now();
  const diffMinutes = Math.floor((now - start) / 60000);
  return formatDuration(diffMinutes);
}

function handleStatusChange(status: SeatStatus) {
  emit("statusChange", props.seat.id, status);
}

function handleOverlayClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    emit("close");
  }
}

const usedTime = computed(() => calculateUsedTime(props.seat.startTime));
</script>

<template>
  <div class="detail-overlay" @click="handleOverlayClick">
    <div class="detail-modal">
      <div class="detail-header">
        <div>
          <span class="seat-code-large">{{ seat.seatCode }}</span>
          <span :class="['status-badge', statusColor[seat.status]]">
            {{ SeatStatusLabel[seat.status] }}
          </span>
        </div>
        <button class="close-btn" @click="emit('close')">×</button>
      </div>

      <div class="detail-body">
        <div class="info-section">
          <h4>机位信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">所属区域</span>
              <span class="info-value">{{ SeatZoneLabel[seat.zone] }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">当前状态</span>
              <span :class="['info-value', statusColor[seat.status]]">
                {{ SeatStatusLabel[seat.status] }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="seat.memberName" class="info-section">
          <h4>会员信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">会员姓名</span>
              <span class="info-value">{{ seat.memberName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">会员等级</span>
              <span class="info-value">{{ seat.memberLevel || "-" }}</span>
            </div>
          </div>
        </div>

        <div v-if="seat.status === 'IN_USE'" class="info-section">
          <h4>使用信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">开始时间</span>
              <span class="info-value">{{ formatDateTime(seat.startTime) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">已用时长</span>
              <span class="info-value">{{ usedTime }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">剩余时长</span>
              <span class="info-value highlight">
                {{ seat.remainingMinutes > 0 ? formatDuration(seat.remainingMinutes) : "-" }}
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">预计结束</span>
              <span class="info-value">
                {{ seat.startTime && seat.remainingMinutes > 0
                  ? formatDateTime(new Date(new Date(seat.startTime).getTime() + seat.remainingMinutes * 60000).toISOString())
                  : "-" }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="seat.status === 'RESERVED' && seat.memberName" class="info-section">
          <h4>预约信息</h4>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">预约人</span>
              <span class="info-value">{{ seat.memberName }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">会员等级</span>
              <span class="info-value">{{ seat.memberLevel || "-" }}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <h4>状态操作</h4>
          <div class="action-buttons">
            <button
              v-for="status in availableStatuses"
              :key="status.value"
              :class="['action-btn', statusColor[status.value], { disabled: seat.status === status.value }]"
              :disabled="seat.status === status.value"
              @click="handleStatusChange(status.value)"
            >
              {{ status.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, #162423 60%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.detail-modal {
  background: #f1f8f6;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 60px color-mix(in srgb, #162423 40%, transparent);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid color-mix(in srgb, #162423 12%, transparent);
  position: sticky;
  top: 0;
  background: #f1f8f6;
  border-radius: 12px 12px 0 0;
}

.seat-code-large {
  font-size: 28px;
  font-weight: 800;
  margin-right: 12px;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.status-badge.available {
  background: color-mix(in srgb, #22c55e 20%, transparent);
  color: #15803d;
}

.status-badge.in-use {
  background: color-mix(in srgb, #f59e0b 20%, transparent);
  color: #b45309;
}

.status-badge.fault {
  background: color-mix(in srgb, #ef4444 20%, transparent);
  color: #b91c1c;
}

.status-badge.reserved {
  background: color-mix(in srgb, #8b5cf6 20%, transparent);
  color: #6d28d9;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: color-mix(in srgb, #162423 10%, transparent);
  border-radius: 8px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: color-mix(in srgb, #162423 20%, transparent);
}

.detail-body {
  padding: 20px 24px 24px;
}

.info-section {
  margin-bottom: 24px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-section h4 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 700;
  color: color-mix(in srgb, #162423 60%, transparent);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-item {
  padding: 12px 14px;
  background: color-mix(in srgb, #f1f8f6 86%, white 14%);
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, #162423 10%, transparent);
}

.info-label {
  display: block;
  font-size: 12px;
  color: color-mix(in srgb, #162423 50%, transparent);
  margin-bottom: 4px;
}

.info-value {
  display: block;
  font-size: 15px;
  font-weight: 600;
}

.info-value.highlight {
  color: #1b7f82;
  font-size: 17px;
}

.info-value.available {
  color: #15803d;
}

.info-value.in-use {
  color: #b45309;
}

.info-value.fault {
  color: #b91c1c;
}

.info-value.reserved {
  color: #6d28d9;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.action-btn {
  padding: 12px 16px;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.available {
  background: color-mix(in srgb, #22c55e 15%, transparent);
  border-color: color-mix(in srgb, #22c55e 30%, transparent);
  color: #15803d;
}

.action-btn.available:hover:not(.disabled) {
  background: color-mix(in srgb, #22c55e 25%, transparent);
}

.action-btn.in-use {
  background: color-mix(in srgb, #f59e0b 15%, transparent);
  border-color: color-mix(in srgb, #f59e0b 30%, transparent);
  color: #b45309;
}

.action-btn.in-use:hover:not(.disabled) {
  background: color-mix(in srgb, #f59e0b 25%, transparent);
}

.action-btn.fault {
  background: color-mix(in srgb, #ef4444 15%, transparent);
  border-color: color-mix(in srgb, #ef4444 30%, transparent);
  color: #b91c1c;
}

.action-btn.fault:hover:not(.disabled) {
  background: color-mix(in srgb, #ef4444 25%, transparent);
}

.action-btn.reserved {
  background: color-mix(in srgb, #8b5cf6 15%, transparent);
  border-color: color-mix(in srgb, #8b5cf6 30%, transparent);
  color: #6d28d9;
}

.action-btn.reserved:hover:not(.disabled) {
  background: color-mix(in srgb, #8b5cf6 25%, transparent);
}

.action-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .detail-header {
    padding: 16px;
  }

  .detail-body {
    padding: 16px;
  }
}
</style>
