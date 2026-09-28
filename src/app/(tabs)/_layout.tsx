import { Tabs } from "expo-router";
import { History, PersonStanding, User } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#22c55e",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopColor: "rgba(255,255,255,0.08)",
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "HOME",
          tabBarIcon: ({ color, size }) => <PersonStanding color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "HISTORY",
          tabBarIcon: ({ color, size }) => <History color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "PROFILE",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
