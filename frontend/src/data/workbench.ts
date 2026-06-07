import type { FeatureItem, KpiItem, OperationRecord, Seat, SeatStatistics, ZoneSeatStatistics } from "../types";

const now = new Date();
const minutesAgo = (min: number) => new Date(now.getTime() - min * 60000).toISOString();

export const localSeats: Seat[] = [
  { id: 1, seatCode: "A01", zone: "HALL", status: "AVAILABLE", remainingMinutes: 0, createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 2, seatCode: "A02", zone: "HALL", status: "IN_USE", memberName: "张三", memberLevel: "黄金会员", remainingMinutes: 125, startTime: minutesAgo(55), createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 3, seatCode: "A03", zone: "HALL", status: "AVAILABLE", remainingMinutes: 0, createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 4, seatCode: "A04", zone: "HALL", status: "IN_USE", memberName: "李四", memberLevel: "普通会员", remainingMinutes: 45, startTime: minutesAgo(75), createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 5, seatCode: "A05", zone: "HALL", status: "FAULT", remainingMinutes: 0, createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 6, seatCode: "A06", zone: "HALL", status: "RESERVED", memberName: "王五", memberLevel: "钻石会员", remainingMinutes: 0, createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 7, seatCode: "A07", zone: "HALL", status: "AVAILABLE", remainingMinutes: 0, createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 8, seatCode: "A08", zone: "HALL", status: "IN_USE", memberName: "赵六", memberLevel: "普通会员", remainingMinutes: 180, startTime: minutesAgo(30), createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 9, seatCode: "B01", zone: "BOX", status: "IN_USE", memberName: "陈七", memberLevel: "钻石会员", remainingMinutes: 90, startTime: minutesAgo(90), createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 10, seatCode: "B02", zone: "BOX", status: "AVAILABLE", remainingMinutes: 0, createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 11, seatCode: "B03", zone: "BOX", status: "IN_USE", memberName: "周八", memberLevel: "黄金会员", remainingMinutes: 60, startTime: minutesAgo(120), createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 12, seatCode: "B04", zone: "BOX", status: "RESERVED", memberName: "吴九", memberLevel: "黄金会员", remainingMinutes: 0, createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 13, seatCode: "B05", zone: "BOX", status: "AVAILABLE", remainingMinutes: 0, createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 14, seatCode: "B06", zone: "BOX", status: "FAULT", remainingMinutes: 0, createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 15, seatCode: "V01", zone: "VIP", status: "IN_USE", memberName: "郑十", memberLevel: "钻石会员", remainingMinutes: 240, startTime: minutesAgo(60), createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 16, seatCode: "V02", zone: "VIP", status: "AVAILABLE", remainingMinutes: 0, createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 17, seatCode: "V03", zone: "VIP", status: "IN_USE", memberName: "冯十一", memberLevel: "钻石会员", remainingMinutes: 150, startTime: minutesAgo(45), createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 18, seatCode: "V04", zone: "VIP", status: "RESERVED", memberName: "钱十二", memberLevel: "钻石会员", remainingMinutes: 0, createdAt: now.toISOString(), updatedAt: now.toISOString() },
  { id: 19, seatCode: "V05", zone: "VIP", status: "AVAILABLE", remainingMinutes: 0, createdAt: now.toISOString(), updatedAt: now.toISOString() },
];

export const localSeatStatistics: SeatStatistics = {
  totalSeats: 19,
  availableSeats: 9,
  inUseSeats: 7,
  faultSeats: 2,
  reservedSeats: 3,
  occupancyRate: 36.8,
};

export const localZoneStatistics: ZoneSeatStatistics[] = [
  { zone: "HALL", zoneLabel: "大厅", totalSeats: 8, availableSeats: 4, inUseSeats: 3, faultSeats: 1, reservedSeats: 1 },
  { zone: "BOX", zoneLabel: "包厢", totalSeats: 6, availableSeats: 2, inUseSeats: 2, faultSeats: 1, reservedSeats: 1 },
  { zone: "VIP", zoneLabel: "VIP区", totalSeats: 5, availableSeats: 3, inUseSeats: 2, faultSeats: 0, reservedSeats: 1 },
];

export const localFeatures: FeatureItem[] = [
  {
    "id": 1,
    "title": "机位/包厢实时状态看板",
    "description": "以网格或列表形式展示所有机位/包厢的实时状态（空闲/使用中/故障/预约），支持按区域筛选，点击可查看详情。",
    "status": "已上线",
    "metric": "88%"
  },
  {
    "id": 2,
    "title": "会员充值与时长包",
    "description": "会员账户支持充值余额，购买时长包（如10小时/30小时/月卡），消费时优先扣除时长包余额，不足时扣余额。",
    "status": "排期中",
    "metric": "31 单"
  },
  {
    "id": 3,
    "title": "机位预约与续费",
    "description": "会员可提前预约指定机位和时段，到店扫码开机，使用过程中可续费延长上机时间，快到期前提醒续费。",
    "status": "巡检中",
    "metric": "10 项"
  },
  {
    "id": 4,
    "title": "上机时长排行榜",
    "description": "记录会员累计上机时长，生成日/周/月排行榜，激励高频玩家，支持按游戏类型分类统计。",
    "status": "优化中",
    "metric": "4 级"
  },
  {
    "id": 5,
    "title": "赛事报名与战队管理",
    "description": "门店发布电竞赛事（如LOL/CSGO/王者荣耀），玩家以个人或战队形式报名，系统自动抽签分组，记录比赛结果和战绩。",
    "status": "可导出",
    "metric": "28 条"
  }
];

export const localKpis: KpiItem[] = [
  {
    "label": "上座率",
    "value": "36.8%",
    "trend": "7 台使用中",
    "tone": "primary"
  },
  {
    "label": "空闲机位",
    "value": "9",
    "trend": "19 台总计",
    "tone": "cool"
  },
  {
    "label": "使用中",
    "value": "7",
    "trend": "9 台可上",
    "tone": "warm"
  },
  {
    "label": "故障机位",
    "value": "2",
    "trend": "需维修",
    "tone": "neutral"
  }
];

export const operationRecords: OperationRecord[] = [
  {
    "key": "ldesportsbar-1",
    "name": "机位/包厢实时状态看板",
    "owner": "运营组",
    "status": "已上线",
    "metric": "88%",
    "priority": "高"
  },
  {
    "key": "ldesportsbar-2",
    "name": "会员充值与时长包",
    "owner": "管理员",
    "status": "排期中",
    "metric": "31 单",
    "priority": "中"
  },
  {
    "key": "ldesportsbar-3",
    "name": "机位预约与续费",
    "owner": "服务台",
    "status": "巡检中",
    "metric": "10 项",
    "priority": "低"
  },
  {
    "key": "ldesportsbar-4",
    "name": "上机时长排行榜",
    "owner": "财务组",
    "status": "优化中",
    "metric": "4 级",
    "priority": "高"
  },
  {
    "key": "ldesportsbar-5",
    "name": "赛事报名与战队管理",
    "owner": "审核组",
    "status": "可导出",
    "metric": "28 条",
    "priority": "中"
  }
];
