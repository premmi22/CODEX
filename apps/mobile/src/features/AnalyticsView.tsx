import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Chip, ProgressBar } from "react-native-paper";
import { buildAnalyticsSummary, computeParetoCoverage } from "@closetclear/shared";
import { useClosetStore } from "../store/useClosetStore";
import { palette, typography } from "../theme";
import { SurfaceCard } from "../components/SurfaceCard";

export const AnalyticsView: React.FC = () => {
  const { items, wearEvents } = useClosetStore();
  const now = new Date().toISOString();
  const summary = buildAnalyticsSummary(items, wearEvents, now);
  const pareto = computeParetoCoverage(items, wearEvents);

  return (
    <View style={styles.container}>
      <Text style={typography.h2}>Closet analytics</Text>
      <SurfaceCard>
        <Text style={typography.h3}>80/20</Text>
        <Text style={{ ...typography.body, color: palette.muted }}>
          {pareto.coverageItems.length} items drive 80% of wears ({pareto.coveragePercent * 100}% of closet)
        </Text>
        <ProgressBar progress={Math.min(pareto.coveragePercent, 1)} color={palette.accent} style={{ marginTop: 8 }} />
      </SurfaceCard>

      <SurfaceCard>
        <Text style={typography.h3}>Top worn</Text>
        <View style={styles.row}>
          {summary.topWorn.map((item) => (
            <Chip key={item.id} style={styles.chip}>
              {item.name ?? item.category}
            </Chip>
          ))}
        </View>
      </SurfaceCard>

      <SurfaceCard>
        <Text style={typography.h3}>Unused (6m)</Text>
        {summary.unused.map((item) => (
          <Text key={item.id} style={typography.body}>
            • {item.name ?? item.category}
          </Text>
        ))}
        {summary.unused.length === 0 && <Text style={typography.caption}>All items are active.</Text>}
      </SurfaceCard>

      <SurfaceCard>
        <Text style={typography.h3}>Shareable report</Text>
        <Text style={{ ...typography.body, color: palette.muted }}>
          Tap below to generate a static image of your closet metrics. (Offline stub)
        </Text>
        <Button mode="outlined" textColor={palette.primary}>Generate report card</Button>
      </SurfaceCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: palette.background },
  row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: { backgroundColor: "#fff" }
});
