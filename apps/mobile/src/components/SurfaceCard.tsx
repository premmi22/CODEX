import React, { PropsWithChildren } from "react";
import { View, StyleSheet } from "react-native";
import { cardShadow, palette } from "../theme";

export const SurfaceCard: React.FC<PropsWithChildren<{ padding?: number }>> = ({ children, padding = 16 }) => {
  return <View style={[styles.card, { padding }]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    ...cardShadow
  }
});
