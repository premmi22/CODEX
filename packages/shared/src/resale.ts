import { Item } from "./types";

type BrandTier = "premium" | "fastfashion" | "standard";

const categoryBaselines: Record<string, number> = {
  top: 25,
  shirt: 30,
  blouse: 35,
  knitwear: 40,
  jacket: 80,
  coat: 120,
  blazer: 90,
  pants: 45,
  jeans: 50,
  skirt: 40,
  dress: 70,
  shoes: 70,
  sneaker: 90,
  heels: 110,
  boots: 120,
  accessory: 30,
  bag: 60,
  scarf: 25
};

const brandTiers: Record<string, BrandTier> = {
  gucci: "premium",
  prada: "premium",
  zara: "fastfashion",
  hm: "fastfashion"
};

const brandMultiplier: Record<BrandTier, number> = {
  premium: 1.4,
  fastfashion: 0.8,
  standard: 1
};

const conditionMultiplier: Record<Item["condition"], number> = {
  new: 1.2,
  good: 1,
  worn: 0.7
};

const confidenceFromPrice = (price: number): "high" | "medium" | "low" => {
  if (price >= 120) return "high";
  if (price >= 60) return "medium";
  return "low";
};

export const estimateResale = (item: Item): { estimate: number; confidence: "high" | "medium" | "low"; breakdown: string[] } => {
  const baseline = categoryBaselines[item.category] ?? 30;
  const brandTier = brandTiers[item.brand?.toLowerCase() ?? ""] ?? "standard";
  const brandFactor = brandMultiplier[brandTier];
  const conditionFactor = conditionMultiplier[item.condition];
  const estimate = Number((baseline * brandFactor * conditionFactor).toFixed(0));
  const breakdown = [
    `Baseline for ${item.category}: $${baseline}`,
    `Brand tier: ${brandTier} (x${brandFactor})`,
    `Condition: ${item.condition} (x${conditionFactor})`
  ];

  return { estimate, confidence: confidenceFromPrice(estimate), breakdown };
};

export const buildListingDraft = (item: Item): { title: string; description: string; bullets: string[]; shippingNote: string } => {
  const title = `${item.brand ? `${item.brand} ` : ""}${item.category} - ${item.color}`;
  const description = `Minimal wear, stored in a smoke-free home. Versatile ${item.category} that pairs well with modern basics.`;
  const bullets = [
    `Condition: ${item.condition}`,
    `Material: ${item.material ?? "N/A"}`,
    `Season: ${item.season}`,
    `Formality: ${item.formality}/3`
  ];
  const shippingNote = "Ships within 2 business days. Eco packaging used.";
  return { title, description, bullets, shippingNote };
};
