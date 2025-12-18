import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Chip } from "react-native-paper";
import { generateOutfits, OutfitRecommendation } from "@closetclear/shared";
import { useClosetStore } from "../store/useClosetStore";
import { palette, typography } from "../theme";
import { SurfaceCard } from "../components/SurfaceCard";

export const OutfitBuilder: React.FC = () => {
  const { items } = useClosetStore();
  const [context, setContext] = React.useState<"work" | "event" | "travel" | "casual">("work");
  const [season, setSeason] = React.useState<"spring" | "summer" | "fall" | "winter">("spring");
  const [outfits, setOutfits] = React.useState<OutfitRecommendation[]>([]);

  React.useEffect(() => {
    setOutfits(generateOutfits(items, context, season));
  }, [items, context, season]);

  return (
    <View style={styles.container}>
      <Text style={typography.h2}>Outfit builder</Text>
      <View style={styles.row}>
        {["work", "event", "travel", "casual"].map((ctx) => (
          <Chip key={ctx} selected={context === ctx} onPress={() => setContext(ctx as typeof context)} style={styles.chip}>
            {ctx}
          </Chip>
        ))}
      </View>
      <View style={styles.row}>
        {["spring", "summer", "fall", "winter"].map((s) => (
          <Chip key={s} selected={season === s} onPress={() => setSeason(s as typeof season)} style={styles.chip}>
            {s}
          </Chip>
        ))}
      </View>

      <View style={{ gap: 12 }}>
        {outfits.map((outfit) => (
          <SurfaceCard key={outfit.id}>
            <Text style={typography.h3}>Score: {outfit.score}</Text>
            <Text style={{ ...typography.body, color: palette.muted }}>{outfit.rationale}</Text>
            <View style={styles.row}>
              {outfit.items.map((item) => (
                <Chip key={item.id} style={styles.chip}>
                  {item.name ?? item.category}
                </Chip>
              ))}
            </View>
          </SurfaceCard>
        ))}
        {outfits.length === 0 && <Text style={typography.body}>Add more items to unlock outfit ideas.</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: palette.background },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { backgroundColor: "#fff" }
});
