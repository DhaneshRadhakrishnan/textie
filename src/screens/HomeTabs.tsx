import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatsScreen from "./ChatsScreen";
import StatusScreen from "./StatusScreen";
import CallsScreen from "./CallsScreen";
import { Ionicons } from "@expo/vector-icons";
import { View, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const Tabs = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName = "chatbubble-ellipses";
          if (route.name === "Chats") iconName = "chatbubble-ellipses";
          else if (route.name === "Status") iconName = "time";
          else if (route.name === "Calls") iconName = "call";

          return (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: Platform.OS === "ios" ? 0 : 0,
              }}
            >
              {focused ? (
                <LinearGradient
                  colors={["#5CBFE3", "#F9AD6E"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: "#fff",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name={iconName as any} size={26} color="#5CBFE3" />
                  </View>
                </LinearGradient>
              ) : (
                <Ionicons
                  name={iconName as any}
                  size={26}
                  color={color}
                  style={{ marginBottom: 8 }}
                />
              )}
            </View>
          );
        },
        tabBarLabel: ({ focused, color }) => {
          return null; // Remove labels for cleaner look, or customize as needed
        },
        tabBarActiveTintColor: "#5CBFE3",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          height: Platform.OS === "ios" ? 88 : 70,
          backgroundColor: "#ffffff",
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          paddingTop: 10,
        },
      })}
    >
      <Tabs.Screen
        name="Chats"
        component={ChatsScreen}
        options={{ headerShown: false }}
      />
      <Tabs.Screen
        name="Status"
        component={StatusScreen}
        options={{ headerShown: false }}
      />
      <Tabs.Screen
        name="Calls"
        component={CallsScreen}
        options={{ headerShown: false }}
      />
    </Tabs.Navigator>
  );
}