import React from "react";
import { View, Text, FlatList, Image, StyleSheet, TextInput } from "react-native";
import { Chip } from "react-native-paper";
import { useClosetStore } from "../store/useClosetStore";
import { palette, typography } from "../theme";
import { SurfaceCard } from "../components/SurfaceCard";

export const ClosetGrid: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
  const { items } = useClosetStore();
  const [filter, setFilter] = React.useState<string>("");
  const filtered = React.useMemo(() => {
    const query = filter.toLowerCase();
    return items.filter((item) => item.name?.toLowerCase().includes(query) || item.tags.some((tag) => tag.includes(query)));
  }, [filter, items]);

  return (
    <View style={styles.container}>
      <Text style={typography.h2}>Closet</Text>
      <TextInput
        placeholder="Search brand / tags"
        value={filter}
        onChangeText={setFilter}
        style={styles.search}
        placeholderTextColor={palette.muted}
      />
      <View style={styles.filterRow}>
        {(["work", "casual", "event"] as const).map((tag) => (
          <Chip key={tag} onPress={() => setFilter(tag)} selected={filter === tag} style={styles.chip}>
            {tag}
          </Chip>
        ))}
      </View>
      <FlatList
        data={filtered}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 80 }}
        renderItem={({ item }) => (
          <SurfaceCard padding={10}>
            <Text style={{ ...typography.body, marginBottom: 6 }}>{item.name ?? item.category}</Text>
            <Image source={{ uri: item.imageUri }} style={styles.image} />
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
              <Chip compact style={styles.smallChip}>{item.color}</Chip>
              <Chip compact style={styles.smallChip}>{item.season}</Chip>
            </View>
            <Chip onPress={() => onSelect(item.id)} style={[styles.chip, { marginTop: 8 }]}>
              Open
            </Chip>
          </SurfaceCard>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, gap: 10, backgroundColor: palette.background },
  search: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 12,
    color: palette.primary,
    backgroundColor: "#fff"
  },
  filterRow: { flexDirection: "row", gap: 8 },
  chip: { backgroundColor: "#fff" },
  smallChip: { backgroundColor: "#f1f1f1" },
  image: { width: "100%", height: 140, borderRadius: 12, backgroundColor: palette.border }
});
