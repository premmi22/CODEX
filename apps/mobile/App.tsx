import React from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import { PaperProvider, BottomNavigation } from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { palette } from "./src/theme";
import { useClosetStore } from "./src/store/useClosetStore";
import { Onboarding } from "./src/features/Onboarding";
import { HomeDashboard } from "./src/features/HomeDashboard";
import { ClosetGrid } from "./src/features/ClosetGrid";
import { ItemDetails } from "./src/features/ItemDetails";
import { ScanAdd } from "./src/features/ScanAdd";
import { OutfitBuilder } from "./src/features/OutfitBuilder";
import { AnalyticsView } from "./src/features/AnalyticsView";
import { ResellDonate } from "./src/features/ResellDonate";
import { Settings } from "./src/features/Settings";

const queryClient = new QueryClient();

export default function App(): JSX.Element {
  const { initialize } = useClosetStore();
  const [isOnboarded, setOnboarded] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [detailId, setDetailId] = React.useState<string | undefined>();
  const [routes] = React.useState([
    { key: "home", title: "Home", focusedIcon: "home" },
    { key: "closet", title: "Closet", focusedIcon: "hanger" },
    { key: "add", title: "Scan", focusedIcon: "camera" },
    { key: "outfits", title: "Outfits", focusedIcon: "tshirt-crew" },
    { key: "analytics", title: "Analytics", focusedIcon: "chart-bar" },
    { key: "resell", title: "Resell", focusedIcon: "shopping" },
    { key: "settings", title: "Settings", focusedIcon: "cog" }
  ]);

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  const renderScene = BottomNavigation.SceneMap({
    home: () => <HomeDashboard onScan={() => setIndex(2)} onPlanOutfit={() => setIndex(3)} />,
    closet: () => (
      <View style={{ flex: 1 }}>
        <ClosetGrid onSelect={(id) => setDetailId(id)} />
        {detailId && <ItemDetails itemId={detailId} onClose={() => setDetailId(undefined)} />}
      </View>
    ),
    add: () => <ScanAdd />,
    outfits: () => <OutfitBuilder />,
    analytics: () => <AnalyticsView />,
    resell: () => <ResellDonate />,
    settings: () => <Settings />
  });

  if (!isOnboarded) {
    return (
      <PaperProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
          <StatusBar barStyle="dark-content" />
          <Onboarding onComplete={() => setOnboarded(true)} />
        </SafeAreaView>
      </PaperProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
          <StatusBar barStyle="dark-content" />
          <BottomNavigation
            shifting
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            activeColor={palette.accent}
            inactiveColor={"#9aa1b5"}
            barStyle={{ backgroundColor: "#fff" }}
          />
        </SafeAreaView>
      </PaperProvider>
    </QueryClientProvider>
  );
}
