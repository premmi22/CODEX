import { v4 as uuidv4 } from "uuid";
import { Item, OutfitContext, OutfitRecommendation, SeasonEnum } from "./types";

const contextRequirements: Record<OutfitContext, { slots: string[]; minFormality: number }> = {
  work: { slots: ["top", "bottom", "shoes", "outerwear"], minFormality: 2 },
  event: { slots: ["top", "bottom", "shoes", "accessory"], minFormality: 2 },
  travel: { slots: ["top", "bottom", "shoes", "outerwear"], minFormality: 1 },
  casual: { slots: ["top", "bottom", "shoes"], minFormality: 0 }
};

const slotByCategory: Record<string, string> = {
  top: "top",
  shirt: "top",
  blouse: "top",
  tee: "top",
  knitwear: "top",
  jacket: "outerwear",
  coat: "outerwear",
  blazer: "outerwear",
  bottom: "bottom",
  pants: "bottom",
  jeans: "bottom",
  skirt: "bottom",
  dress: "bottom",
  shoes: "shoes",
  sneaker: "shoes",
  heels: "shoes",
  boots: "shoes",
  accessory: "accessory",
  bag: "accessory",
  scarf: "accessory"
};

const seasonScore = (itemSeason: string, targetSeason: string): number => {
  if (itemSeason === "all") return 1;
  if (itemSeason === targetSeason) return 1;
  return 0.5;
};

const colorHarmonyScore = (colors: string[]): number => {
  const unique = new Set(colors.map((c) => c.toLowerCase()));
  if (unique.size === 1) return 1;
  const hasNeutral = colors.some((c) => ["black", "white", "navy", "gray", "beige"].includes(c.toLowerCase()));
  return hasNeutral ? 0.8 : 0.5;
};

const formalityScore = (items: Item[], minFormality: number): number => {
  const avg = items.reduce((acc, item) => acc + item.formality, 0) / Math.max(items.length, 1);
  return avg >= minFormality ? 1 : 0.6;
};

const pickForSlot = (items: Item[], slot: string, minFormality: number, season: SeasonEnum["_type"]): Item[] => {
  return items.filter((item) => {
    const mappedSlot = slotByCategory[item.category] ?? item.category;
    return (
      mappedSlot === slot &&
      item.formality >= minFormality - 1 &&
      seasonScore(item.season, season) >= 0.5
    );
  });
};

export const generateOutfits = (
  inventory: Item[],
  context: OutfitContext,
  season: SeasonEnum["_type"]
): OutfitRecommendation[] => {
  const requirement = contextRequirements[context];
  const outfits: OutfitRecommendation[] = [];

  const candidates: Item[][] = requirement.slots.map((slot) => pickForSlot(inventory, slot, requirement.minFormality, season));
  if (candidates.some((slotItems) => slotItems.length === 0)) {
    return [];
  }

  for (let i = 0; i < 3; i += 1) {
    const items: Item[] = requirement.slots.map((slot, index) => {
      const slotItems = candidates[index];
      return slotItems[(i + index) % slotItems.length];
    });

    const score = Number(
      (
        0.4 * colorHarmonyScore(items.map((it) => it.color)) +
        0.3 * formalityScore(items, requirement.minFormality) +
        0.3 *
          (items.reduce((acc, item) => acc + seasonScore(item.season, season), 0) /
            Math.max(items.length, 1))
      ).toFixed(2)
    );

    const rationale = `Balanced color palette, season-ready for ${season}, fits ${context} dress code.`;
    outfits.push({ id: uuidv4(), items, context, score, rationale });
  }

  return outfits;
};
