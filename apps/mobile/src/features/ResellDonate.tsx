import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Chip } from "react-native-paper";
import { useClosetStore } from "../store/useClosetStore";
import { estimateResale } from "@closetclear/shared";
import { palette, typography } from "../theme";
import { SurfaceCard } from "../components/SurfaceCard";

export const ResellDonate: React.FC = () => {
  const { items } = useClosetStore();
  const candidates = items.filter((item) => item.condition !== "new");

  return (
    <View style={styles.container}>
      <Text style={typography.h2}>Resell / Donate</Text>
      {candidates.map((item) => {
        const resale = estimateResale(item);
        const donateCandidate = resale.estimate < 40;
        return (
          <SurfaceCard key={item.id}>
            <Text style={typography.h3}>{item.name ?? item.category}</Text>
            <Text style={{ ...typography.caption, color: palette.muted }}>{item.brand ?? "Unknown brand"}</Text>
            <View style={styles.row}>
              <Chip style={styles.chip}>${resale.estimate}</Chip>
              <Chip style={styles.chip}>{resale.confidence}</Chip>
              <Chip style={styles.chip}>{donateCandidate ? "Donate" : "Resell"}</Chip>
            </View>
            <Text style={typography.body}>{resale.breakdown.join(" · ")}</Text>
            <Button mode="text" textColor={palette.accent}>
              Create listing draft
            </Button>
          </SurfaceCard>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: palette.background },
  row: { flexDirection: "row", gap: 8, marginVertical: 6 },
  chip: { backgroundColor: "#fff" }
});
