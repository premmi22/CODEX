import { z } from "zod";

export const SeasonEnum = z.enum(["spring", "summer", "fall", "winter", "all"]);
export const ConditionEnum = z.enum(["new", "good", "worn"]);

export const ItemSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  imageUri: z.string(),
  name: z.string().nullable(),
  category: z.string(),
  brand: z.string().nullable(),
  color: z.string(),
  material: z.string().nullable(),
  season: SeasonEnum,
  formality: z.number().min(0).max(3),
  condition: ConditionEnum,
  purchasePrice: z.number().nullable(),
  tags: z.array(z.string())
});

export type Item = z.infer<typeof ItemSchema>;

export const WearEventSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  wornAt: z.string()
});

export type WearEvent = z.infer<typeof WearEventSchema>;

export type OutfitContext = "work" | "event" | "travel" | "casual";

export type OutfitRecommendation = {
  id: string;
  items: Item[];
  context: OutfitContext;
  score: number;
  rationale: string;
};

export type ResaleEstimate = {
  suggestedPrice: number;
  confidence: "high" | "medium" | "low";
  breakdown: string[];
};
