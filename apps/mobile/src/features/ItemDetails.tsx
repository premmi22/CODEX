import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Button, Chip } from "react-native-paper";
import { useClosetStore } from "../store/useClosetStore";
import { palette, typography } from "../theme";
import { buildListingDraft, estimateResale } from "@closetclear/shared";

export const ItemDetails: React.FC<{ itemId: string; onClose: () => void }> = ({ itemId, onClose }) => {
  const { items, markWorn } = useClosetStore();
  const item = items.find((it) => it.id === itemId);
  const resale = item ? estimateResale(item) : undefined;
  const draft = item ? buildListingDraft(item) : undefined;

  if (!item) return null;

  return (
    <View style={styles.container}>
      <Button onPress={onClose} textColor={palette.muted}>
        Close
      </Button>
      <Image source={{ uri: item.imageUri }} style={styles.hero} />
      <Text style={typography.h1}>{item.name ?? item.category}</Text>
      <Text style={{ ...typography.body, color: palette.muted }}>{item.brand ?? "Unknown brand"}</Text>

      <View style={styles.row}>
        <Chip>{item.color}</Chip>
        <Chip>{item.season}</Chip>
        <Chip>{item.condition}</Chip>
      </View>

      <Button mode="contained" buttonColor={palette.accent} onPress={() => markWorn(item.id)}>
        Mark as worn today
      </Button>

      {resale && (
        <View style={styles.section}>
          <Text style={typography.h2}>Resale estimate</Text>
          <Text style={typography.h3}>${resale.estimate} · {resale.confidence} confidence</Text>
          {resale.breakdown.map((line) => (
            <Text key={line} style={{ ...typography.body, color: palette.muted }}>
              {line}
            </Text>
          ))}
        </View>
      )}

      {draft && (
        <View style={styles.section}>
          <Text style={typography.h2}>Listing draft</Text>
          <Text style={typography.body}>{draft.title}</Text>
          <Text style={{ ...typography.body, color: palette.muted }}>{draft.description}</Text>
          {draft.bullets.map((b) => (
            <Text key={b} style={typography.caption}>
              • {b}
            </Text>
          ))}
          <Text style={typography.caption}>{draft.shippingNote}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10, backgroundColor: palette.background },
  hero: { width: "100%", height: 260, borderRadius: 18, backgroundColor: palette.border },
  row: { flexDirection: "row", gap: 8 },
  section: { marginTop: 12, gap: 6 }
});
