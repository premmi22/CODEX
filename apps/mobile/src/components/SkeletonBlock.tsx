import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import { palette } from "../theme";

export const SkeletonBlock: React.FC<{ height: number; width?: string | number }> = ({ height, width = "100%" }) => {
  const opacity = React.useRef(new Animated.Value(0.4)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.9, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, [opacity]);

  return <Animated.View style={[styles.block, { height, width, opacity }]} />;
};

const styles = StyleSheet.create({
  block: {
    backgroundColor: palette.border,
    borderRadius: 12
  }
});
