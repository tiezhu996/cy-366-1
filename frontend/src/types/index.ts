export type SeatStatus = "AVAILABLE" | "IN_USE" | "FAULT" | "RESERVED";
export type SeatZone = "HALL" | "BOX" | "VIP";

export const SeatStatusLabel: Record<SeatStatus, string> = {
  AVAILABLE: "空闲",
  IN_USE: "使用中",
  FAULT: "故障",
  RESERVED: "预约",
};

export const SeatZoneLabel: Record<SeatZone, string> = {
  HALL: "大厅",
  BOX: "包厢",
  VIP: "VIP区",
};

export interface Seat {
  id: number;
  seatCode: string;
  zone: SeatZone;
  status: SeatStatus;
  memberName?: string;
  memberLevel?: string;
  remainingMinutes: number;
  startTime?: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SeatStatistics {
  totalSeats: number;
  availableSeats: number;
  inUseSeats: number;
  faultSeats: number;
  reservedSeats: number;
  occupancyRate: number;
}

export interface ZoneSeatStatistics {
  zone: SeatZone;
  zoneLabel: string;
  totalSeats: number;
  availableSeats: number;
  inUseSeats: number;
  faultSeats: number;
  reservedSeats: number;
}

export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  status: string;
  metric: string;
}

export interface KpiItem {
  label: string;
  value: string;
  trend: string;
  tone: string;
}

export interface OperationRecord {
  key: string;
  name: string;
  owner: string;
  status: string;
  metric: string;
  priority: string;
}

export interface OverviewResponse {
  appName: string;
  appCode: string;
  description: string;
  features: FeatureItem[];
  kpis: KpiItem[];
  records: OperationRecord[];
  seatStatistics: SeatStatistics;
}
