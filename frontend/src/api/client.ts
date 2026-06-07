import { API_BASE_URL } from "../constants/app";
import type { OverviewResponse, Seat, SeatStatistics, SeatStatus, ZoneSeatStatistics } from "../types";

export async function fetchOverview(): Promise<OverviewResponse> {
  const response = await fetch(`${API_BASE_URL}/overview`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Overview request failed: ${response.status}`);
  }

  return response.json() as Promise<OverviewResponse>;
}

export async function fetchSeats(zone?: string): Promise<Seat[]> {
  const url = zone ? `${API_BASE_URL}/seats?zone=${zone}` : `${API_BASE_URL}/seats`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Seats request failed: ${response.status}`);
  }

  return response.json() as Promise<Seat[]>;
}

export async function fetchSeatById(id: number): Promise<Seat> {
  const response = await fetch(`${API_BASE_URL}/seats/${id}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Seat request failed: ${response.status}`);
  }

  return response.json() as Promise<Seat>;
}

export async function fetchSeatStatistics(): Promise<SeatStatistics> {
  const response = await fetch(`${API_BASE_URL}/seats/statistics`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Seat statistics request failed: ${response.status}`);
  }

  return response.json() as Promise<SeatStatistics>;
}

export async function fetchZoneSeatStatistics(): Promise<ZoneSeatStatistics[]> {
  const response = await fetch(`${API_BASE_URL}/seats/statistics/zones`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Zone statistics request failed: ${response.status}`);
  }

  return response.json() as Promise<ZoneSeatStatistics[]>;
}

export async function updateSeatStatus(id: number, status: SeatStatus): Promise<Seat> {
  const response = await fetch(`${API_BASE_URL}/seats/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Update seat status failed: ${response.status}`);
  }

  return response.json() as Promise<Seat>;
}

export async function updateSeatMember(
  id: number,
  memberName: string,
  memberLevel: string,
  remainingMinutes: number
): Promise<Seat> {
  const response = await fetch(`${API_BASE_URL}/seats/${id}/member`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ memberName, memberLevel, remainingMinutes }),
  });

  if (!response.ok) {
    throw new Error(`Update seat member failed: ${response.status}`);
  }

  return response.json() as Promise<Seat>;
}
