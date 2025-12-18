import { Item, WearEvent } from "./types";

type WearStats = {
  itemId: string;
  wearCount: number;
  lastWorn?: string;
  daysSinceAdded: number;
};

const daysBetween = (from: string, to: string): number => {
  const start = new Date(from).getTime();
  const end = new Date(to).getTime();
  const diff = Math.max(end - start, 0);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const buildWearStats = (
  items: Item[],
  events: WearEvent[],
  now: string
): Record<string, WearStats> => {
  const stats: Record<string, WearStats> = {};
  items.forEach((item) => {
    stats[item.id] = {
      itemId: item.id,
      wearCount: 0,
      daysSinceAdded: Math.max(daysBetween(item.createdAt, now), 1)
    };
  });

  events.forEach((evt) => {
    const record = stats[evt.itemId];
    if (!record) return;
    record.wearCount += 1;
    if (!record.lastWorn || new Date(evt.wornAt) > new Date(record.lastWorn)) {
      record.lastWorn = evt.wornAt;
    }
  });

  return stats;
};

export const computeWearRate = (stat: WearStats): number => {
  return Number((stat.wearCount / stat.daysSinceAdded).toFixed(3));
};

export const identifyUnusedItems = (
  items: Item[],
  events: WearEvent[],
  thresholdDays: number,
  now: string
): Item[] => {
  const stats = buildWearStats(items, events, now);
  return items.filter((item) => {
    const lastWorn = stats[item.id].lastWorn;
    if (!lastWorn) {
      return true;
    }
    return daysBetween(lastWorn, now) > thresholdDays;
  });
};

export const computeParetoCoverage = (
  items: Item[],
  events: WearEvent[]
): { coverageItems: Item[]; coveragePercent: number } => {
  const stats = buildWearStats(items, events, new Date().toISOString());
  const sorted = [...items].sort((a, b) => stats[b.id].wearCount - stats[a.id].wearCount);
  const totalWears = events.length || 1;
  let cumulative = 0;
  const coverage: Item[] = [];

  for (const item of sorted) {
    const wearCount = stats[item.id].wearCount;
    cumulative += wearCount;
    coverage.push(item);
    if (cumulative / totalWears >= 0.8) {
      break;
    }
  }

  const coveragePercent = Number((coverage.length / items.length).toFixed(2));
  return { coverageItems: coverage, coveragePercent };
};

export const buildAnalyticsSummary = (
  items: Item[],
  events: WearEvent[],
  now: string
): {
  topWorn: Item[];
  leastWorn: Item[];
  unused: Item[];
  pareto: { coverageItems: Item[]; coveragePercent: number };
} => {
  const stats = buildWearStats(items, events, now);
  const sorted = [...items].sort((a, b) => stats[b.id].wearCount - stats[a.id].wearCount);
  const topWorn = sorted.slice(0, Math.min(5, sorted.length));
  const leastWorn = sorted.slice(-5).reverse();
  const unused = identifyUnusedItems(items, events, 60, now);
  const pareto = computeParetoCoverage(items, events);

  return { topWorn, leastWorn, unused, pareto };
};
