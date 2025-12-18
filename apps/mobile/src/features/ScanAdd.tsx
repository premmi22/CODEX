import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Button, Chip } from "react-native-paper";
import * as Haptics from "expo-haptics";
import { palette, typography } from "../theme";
import { useClosetStore } from "../store/useClosetStore";
import { SkeletonBlock } from "../components/SkeletonBlock";

export const ScanAdd: React.FC = () => {
  const { addItem } = useClosetStore();
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("shirt");
  const [color, setColor] = React.useState("navy");
  const [formality, setFormality] = React.useState(2);
  const [saving, setSaving] = React.useState(false);

  const save = async (): Promise<void> => {
    setSaving(true);
    await addItem({
      imageUri: "seed://new-item.jpg",
      name,
      category,
      brand: null,
      color,
      material: null,
      season: "all",
      formality,
      condition: "good",
      purchasePrice: null,
      tags: []
    });
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSaving(false);
    setName("");
  };

  return (
    <View style={styles.container}>
      <Text style={typography.h2}>Scan / Add item</Text>
      <Text style={{ ...typography.body, color: palette.muted }}>
        Camera stubbed for offline mode. Enter quick metadata to add an item locally.
      </Text>
      <SkeletonBlock height={200} />
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <View style={styles.row}>
        {["shirt", "blazer", "jeans", "sneaker"].map((cat) => (
          <Chip key={cat} selected={category === cat} onPress={() => setCategory(cat)} style={styles.chip}>
            {cat}
          </Chip>
        ))}
      </View>
      <View style={styles.row}>
        {["black", "navy", "white", "emerald"].map((c) => (
          <Chip key={c} selected={color === c} onPress={() => setColor(c)} style={styles.chip}>
            {c}
          </Chip>
        ))}
      </View>
      <View style={styles.row}>
        {[1, 2, 3].map((f) => (
          <Chip key={f} selected={formality === f} onPress={() => setFormality(f)} style={styles.chip}>
            Formality {f}
          </Chip>
        ))}
      </View>
      <Button mode="contained" buttonColor={palette.primary} textColor="#fff" onPress={save} loading={saving}>
        Save item locally
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12, backgroundColor: palette.background },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { backgroundColor: "#fff" },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 12,
    backgroundColor: "#fff"
  }
});
