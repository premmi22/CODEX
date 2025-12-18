import { describe, expect, it } from "vitest";
import { buildAnalyticsSummary, computeParetoCoverage, estimateResale, generateOutfits } from "../index";
import { Item, WearEvent } from "../types";

const sampleItems: Item[] = [
  {
    id: "1",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    imageUri: "local://1.jpg",
    name: "Black Tee",
    category: "tee",
    brand: "Uniqlo",
    color: "black",
    material: "cotton",
    season: "all",
    formality: 1,
    condition: "good",
    purchasePrice: 20,
    tags: ["basic"]
  },
  {
    id: "2",
    createdAt: "2024-01-10T00:00:00.000Z",
    updatedAt: "2024-01-10T00:00:00.000Z",
    imageUri: "local://2.jpg",
    name: "Navy Blazer",
    category: "blazer",
    brand: "Theory",
    color: "navy",
    material: "wool",
    season: "fall",
    formality: 3,
    condition: "good",
    purchasePrice: 300,
    tags: ["work"]
  },
  {
    id: "3",
    createdAt: "2024-01-10T00:00:00.000Z",
    updatedAt: "2024-01-10T00:00:00.000Z",
    imageUri: "local://3.jpg",
    name: "White Sneakers",
    category: "sneaker",
    brand: "Nike",
    color: "white",
    material: "leather",
    season: "spring",
    formality: 1,
    condition: "good",
    purchasePrice: 120,
    tags: ["casual"]
  }
];

const wearEvents: WearEvent[] = [
  { id: "w1", itemId: "1", wornAt: "2024-03-01T00:00:00.000Z" },
  { id: "w2", itemId: "1", wornAt: "2024-03-02T00:00:00.000Z" },
  { id: "w3", itemId: "2", wornAt: "2024-03-03T00:00:00.000Z" }
];

describe("analytics", () => {
  it("computes pareto coverage", () => {
    const result = computeParetoCoverage(sampleItems, wearEvents);
    expect(result.coverageItems.length).toBeGreaterThan(0);
    expect(result.coveragePercent).toBeGreaterThan(0);
  });

  it("returns analytics summary with unused items", () => {
    const summary = buildAnalyticsSummary(sampleItems, wearEvents, "2024-05-01T00:00:00.000Z");
    expect(summary.unused.length).toBeGreaterThan(0);
    expect(summary.topWorn[0].id).toBe("1");
  });
});

describe("outfit generator", () => {
  it("generates outfits per context", () => {
    const outfits = generateOutfits(sampleItems, "casual", "spring");
    expect(outfits.length).toBeGreaterThan(0);
    expect(outfits[0].items.length).toBeGreaterThan(0);
  });
});

describe("resale estimator", () => {
  it("returns price and confidence", () => {
    const estimate = estimateResale(sampleItems[1]);
    expect(estimate.estimate).toBeGreaterThan(0);
    expect(["high", "medium", "low"]).toContain(estimate.confidence);
  });
});
