import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { palette, typography } from "../theme";
import { useClosetStore } from "../store/useClosetStore";

export const Settings: React.FC = () => {
  const { items, wearEvents } = useClosetStore();

  const exportData = (): string => {
    return JSON.stringify({ items, wearEvents }, null, 2);
  };

  return (
    <View style={styles.container}>
      <Text style={typography.h2}>Settings</Text>
      <Text style={{ ...typography.body, color: palette.muted }}>Data export (JSON)</Text>
      <View style={styles.exportBox}>
        <Text style={styles.code}>{exportData()}</Text>
      </View>
      <Button mode="outlined" textColor={palette.primary}>
        Delete all data (stub)
      </Button>
      <Button mode="contained" buttonColor={palette.accent}>
        Upgrade to Premium ($19) - unlock resell + packing lists
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: palette.background },
  exportBox: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderColor: palette.border,
    borderWidth: 1
  },
  code: { fontFamily: "Menlo", fontSize: 12 }
});
