import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, ProgressBar } from "react-native-paper";
import { SurfaceCard } from "../components/SurfaceCard";
import { palette, typography } from "../theme";
import { useClosetStore } from "../store/useClosetStore";
import { buildAnalyticsSummary, computeParetoCoverage, generateOutfits } from "@closetclear/shared";

export const HomeDashboard: React.FC<{ onScan: () => void; onPlanOutfit: () => void }> = ({ onScan, onPlanOutfit }) => {
  const { items, wearEvents } = useClosetStore();
  const todayOutfit = React.useMemo(() => generateOutfits(items, "work", "spring")[0], [items]);
  const analytics = React.useMemo(
    () => buildAnalyticsSummary(items, wearEvents, new Date().toISOString()),
    [items, wearEvents]
  );
  const pareto = React.useMemo(() => computeParetoCoverage(items, wearEvents), [items, wearEvents]);

  return (
    <View style={styles.container}>
      <View style={{ gap: 12 }}>
        <SurfaceCard>
          <Text style={typography.h2}>Today’s outfit</Text>
          {todayOutfit ? (
            <Text style={{ ...typography.body, marginTop: 6 }}>
              {todayOutfit.items.map((it) => it.name ?? it.category).join(" · ")}
            </Text>
          ) : (
            <Text style={typography.body}>Add a few items to unlock smart picks.</Text>
          )}
          <Button mode="text" onPress={onPlanOutfit} textColor={palette.accent}>
            Plan outfits
          </Button>
        </SurfaceCard>

        <SurfaceCard>
          <Text style={typography.h2}>Wear rate</Text>
          <ProgressBar progress={Math.min(analytics.topWorn.length / Math.max(items.length, 1), 1)} color={palette.accent} style={{ marginTop: 10 }} />
          <Text style={{ ...typography.body, color: palette.muted, marginTop: 6 }}>
            {pareto.coverageItems.length} items drive 80% of your wears.
          </Text>
        </SurfaceCard>

        <SurfaceCard>
          <Text style={typography.h2}>Unused items</Text>
          <Text style={{ ...typography.h3, marginTop: 6 }}>{analytics.unused.length}</Text>
          <Text style={{ ...typography.body, color: palette.muted }}>Flagged for donate/resell review.</Text>
        </SurfaceCard>

        <SurfaceCard>
          <Text style={typography.h2}>Next event</Text>
          <Text style={{ ...typography.body, color: palette.muted }}>No events synced. Add an event in Settings.</Text>
        </SurfaceCard>
      </View>

      <View style={styles.actions}>
        <Button mode="contained" buttonColor={palette.primary} textColor="#fff" onPress={onScan}>
          Scan item
        </Button>
        <Button mode="outlined" textColor={palette.primary} onPress={onPlanOutfit}>
          Plan outfits
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: palette.background, gap: 16 },
  actions: { flexDirection: "row", gap: 12 }
});
