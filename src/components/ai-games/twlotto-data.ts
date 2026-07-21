// src/components/ai-games/twlotto-data.ts

import type { DrawData } from "./mark6-data";

// Historical draws for TW Big Lotto (台灣大樂透)
export const historicalDraws: DrawData[] = [
  { id: "113000001", date: "2024-01-01", numbers: [5, 12, 18, 23, 29, 36], extra: 41 },
  { id: "113000002", date: "2024-01-04", numbers: [3, 8, 15, 22, 31, 38], extra: 44 },
  { id: "113000003", date: "2024-01-08", numbers: [7, 14, 19, 25, 33, 37], extra: 42 },
  { id: "113000004", date: "2024-01-11", numbers: [2, 9, 16, 21, 28, 35], extra: 45 },
  { id: "113000005", date: "2024-01-15", numbers: [6, 11, 20, 26, 30, 34], extra: 48 },
  { id: "113000006", date: "2024-01-18", numbers: [4, 10, 17, 24, 27, 32], extra: 43 },
  { id: "113000007", date: "2024-01-22", numbers: [1, 13, 22, 29, 36, 38], extra: 46 },
  { id: "113000008", date: "2024-01-25", numbers: [8, 12, 18, 23, 31, 37], extra: 49 },
  { id: "113000009", date: "2024-01-29", numbers: [5, 9, 14, 20, 28, 33], extra: 42 },
  { id: "113000010", date: "2024-02-01", numbers: [3, 7, 15, 22, 30, 35], extra: 47 },
];

// Color function for TW Big Lotto balls
export const getBallColor = (num: number): string => {
  if (num <= 10) return "bg-blue-600";
  if (num <= 20) return "bg-green-600";
  if (num <= 30) return "bg-purple-600";
  if (num <= 40) return "bg-orange-600";
  return "bg-red-600";
};

// Compute frequency from historical data
export const computeFrequency = (): Map<number, number> => {
  const freq = new Map<number, number>();
  for (let i = 1; i <= 49; i++) {
    freq.set(i, 0);
  }
  historicalDraws.forEach((draw) => {
    draw.numbers.forEach((n) => {
      freq.set(n, (freq.get(n) || 0) + 1);
    });
    if (draw.extra && draw.extra > 0 && draw.extra <= 49) {
      freq.set(draw.extra, (freq.get(draw.extra) || 0) + 1);
    }
  });
  return freq;
};

// Mock data functions
export const getMockTWLottoData = (limit: number = 10): DrawData[] => {
  return historicalDraws.slice(0, limit);
};

// Async function to fetch real data (placeholder - implement actual API call)
export const getTWLottoDraws = async (limit: number = 10): Promise<DrawData[]> => {
  // TODO: Implement actual API call to Taiwan Lottery
  // For now, return mock data
  return getMockTWLottoData(limit);
};