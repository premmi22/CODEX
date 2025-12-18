import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SurfaceCard } from "../components/SurfaceCard";
import { palette, typography } from "../theme";
import { Button, Chip, Checkbox } from "react-native-paper";

const styleOptions = ["Minimal", "Street", "Classic"] as const;
const dressCodes = ["Casual", "Business", "Formal"] as const;

export const Onboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [style, setStyle] = React.useState<string>(styleOptions[0]);
  const [colors, setColors] = React.useState<string[]>(["black", "white"]);
  const [dressCode, setDressCode] = React.useState<string>(dressCodes[1]);
  const [consent, setConsent] = React.useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, gap: 14 }}>
      <Text style={typography.h1}>ClosetClear</Text>
      <Text style={{ ...typography.body, color: palette.muted }}>
        Scan wardrobe → See what you wear → Get outfits → Sell/Donate the rest. All on-device.
      </Text>

      <SurfaceCard>
        <Text style={typography.h2}>Style</Text>
        <View style={styles.row}>
          {styleOptions.map((option) => (
            <Chip key={option} selected={style === option} onPress={() => setStyle(option)} style={styles.chip}>
              {option}
            </Chip>
          ))}
        </View>
      </SurfaceCard>

      <SurfaceCard>
        <Text style={typography.h2}>Preferred colors</Text>
        <View style={styles.row}>
          {["black", "navy", "white", "oatmeal", "emerald"].map((color) => (
            <Chip
              key={color}
              selected={colors.includes(color)}
              onPress={() =>
                setColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
              }
              style={styles.chip}
            >
              {color}
            </Chip>
          ))}
        </View>
      </SurfaceCard>

      <SurfaceCard>
        <Text style={typography.h2}>Work dresscode</Text>
        <View style={styles.row}>
          {dressCodes.map((code) => (
            <Chip key={code} selected={dressCode === code} onPress={() => setDressCode(code)} style={styles.chip}>
              {code}
            </Chip>
          ))}
        </View>
      </SurfaceCard>

      <SurfaceCard>
        <Text style={typography.h3}>Permissions</Text>
        <Checkbox.Item
          label="Allow camera & storage to save outfits locally"
          status={consent ? "checked" : "unchecked"}
          onPress={() => setConsent((prev) => !prev)}
        />
      </SurfaceCard>

      <Button mode="contained" disabled={!consent} onPress={onComplete} buttonColor={palette.accent}>
        Enter my closet
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  chip: { marginRight: 8, marginBottom: 8 }
});
