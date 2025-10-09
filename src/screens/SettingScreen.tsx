import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeOption, useTheme } from "../theme/ThemeProvider";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";

const options: ThemeOption[] = ["light", "dark", "system"];
type SettingScreenProp = NativeStackNavigationProp<RootStack, "SettingScreen">;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function SettingScreen() {
  const { preference, applied, setPreference } = useTheme();
  const navigation = useNavigation<SettingScreenProp>();

  // Dummy states for settings
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [typingIndicator, setTypingIndicator] = useState(true);
  const [autoDownload, setAutoDownload] = useState(false);
  const [dataCompression, setDataCompression] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation, applied]);

  const SettingSection = ({
    title,
    children,
    delay = 0,
  }: {
    title: string;
    children: React.ReactNode;
    delay?: number;
  }) => (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      className="mb-6"
    >
      <Text
        className={`text-sm font-bold mb-3 px-1 ${
          applied === "dark" ? "text-slate-400" : "text-slate-600"
        }`}
      >
        {title}
      </Text>
      <View
        className={`rounded-3xl overflow-hidden ${
          applied === "dark" ? "bg-slate-800/50" : "bg-white"
        }`}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        {children}
      </View>
    </Animated.View>
  );

  const SettingItem = ({
    icon,
    iconColor,
    iconBg,
    title,
    subtitle,
    onPress,
    showArrow = true,
    rightComponent,
    isLast = false,
  }: {
    icon: string;
    iconColor: string;
    iconBg: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightComponent?: React.ReactNode;
    isLast?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center px-4 py-4 ${
        !isLast
          ? applied === "dark"
            ? "border-b border-slate-700/50"
            : "border-b border-gray-100"
          : ""
      }`}
      activeOpacity={0.7}
    >
      <View
        className="w-11 h-11 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: iconBg }}
      >
        <Ionicons name={icon as any} size={22} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text
          className={`font-semibold text-base ${
            applied === "dark" ? "text-white" : "text-slate-800"
          }`}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            className={`text-sm mt-0.5 ${
              applied === "dark" ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {rightComponent || (
        showArrow && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={applied === "dark" ? "#64748b" : "#94a3b8"}
          />
        )
      )}
    </TouchableOpacity>
  );

  const ToggleItem = ({
    icon,
    iconColor,
    iconBg,
    title,
    subtitle,
    value,
    onValueChange,
    isLast = false,
  }: {
    icon: string;
    iconColor: string;
    iconBg: string;
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    isLast?: boolean;
  }) => (
    <View
      className={`flex-row items-center px-4 py-4 ${
        !isLast
          ? applied === "dark"
            ? "border-b border-slate-700/50"
            : "border-b border-gray-100"
          : ""
      }`}
    >
      <View
        className="w-11 h-11 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: iconBg }}
      >
        <Ionicons name={icon as any} size={22} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text
          className={`font-semibold text-base ${
            applied === "dark" ? "text-white" : "text-slate-800"
          }`}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            className={`text-sm mt-0.5 ${
              applied === "dark" ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#cbd5e1", true: "#5CBFE3" }}
        thumbColor={value ? "#F9AD6E" : "#f1f5f9"}
      />
    </View>
  );

  return (
    <View className={`flex-1 ${applied === "dark" ? "bg-slate-900" : "bg-gray-50"}`}>
      <StatusBar
        barStyle={applied === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Custom Header */}
      <LinearGradient
        colors={
          applied === "dark"
            ? ["#1e293b", "#334155"]
            : ["#5CBFE3", "#7EC8E8"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <SafeAreaView edges={["top"]}>
          <View className="flex-row items-center px-5 py-4">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-white">Settings</Text>
              <Text className="text-white/80 text-sm">
                Customize your Textie experience
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Section */}
        <SettingSection title="APPEARANCE" delay={100}>
          <View className="px-4 py-4">
            <View className="flex-row items-center mb-3">
              <View
                className="w-11 h-11 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: "#5CBFE320" }}
              >
                <Ionicons name="color-palette" size={22} color="#5CBFE3" />
              </View>
              <View className="flex-1">
                <Text
                  className={`font-semibold text-base ${
                    applied === "dark" ? "text-white" : "text-slate-800"
                  }`}
                >
                  App Theme
                </Text>
                <Text
                  className={`text-sm mt-0.5 ${
                    applied === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Choose your preferred theme
                </Text>
              </View>
            </View>
            <View className="flex-row gap-x-2 mt-2">
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  className="flex-1 overflow-hidden rounded-2xl"
                  onPress={() => setPreference(option)}
                  activeOpacity={0.8}
                >
                  {preference === option ? (
                    <LinearGradient
                      colors={["#5CBFE3", "#F9AD6E"]}
                      className="py-3 px-4"
                    >
                      <Text className="text-center font-bold text-white">
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View
                      className={`py-3 px-4 ${
                        applied === "dark" ? "bg-slate-700" : "bg-gray-100"
                      }`}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          applied === "dark" ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SettingSection>

        {/* Notifications Section */}
        <SettingSection title="NOTIFICATIONS" delay={200}>
          <ToggleItem
            icon="notifications"
            iconColor="#F9AD6E"
            iconBg="#F9AD6E20"
            title="Push Notifications"
            subtitle="Receive notifications for new messages"
            value={notifications}
            onValueChange={setNotifications}
          />
          <ToggleItem
            icon="volume-high"
            iconColor="#8b5cf6"
            iconBg="#8b5cf620"
            title="Notification Sounds"
            subtitle="Play sound for incoming messages"
            value={soundEnabled}
            onValueChange={setSoundEnabled}
          />
          <ToggleItem
            icon="phone-portrait"
            iconColor="#ec4899"
            iconBg="#ec489920"
            title="Vibration"
            subtitle="Vibrate on new notifications"
            value={vibrationEnabled}
            onValueChange={setVibrationEnabled}
            isLast
          />
        </SettingSection>

        {/* Privacy Section */}
        <SettingSection title="PRIVACY & SECURITY" delay={300}>
          <ToggleItem
            icon="checkmark-done"
            iconColor="#10b981"
            iconBg="#10b98120"
            title="Read Receipts"
            subtitle="Let others know when you've read their messages"
            value={readReceipts}
            onValueChange={setReadReceipts}
          />
          <ToggleItem
            icon="radio-button-on"
            iconColor="#06b6d4"
            iconBg="#06b6d420"
            title="Online Status"
            subtitle="Show when you're active on Textie"
            value={onlineStatus}
            onValueChange={setOnlineStatus}
          />
          <ToggleItem
            icon="chatbox-ellipses"
            iconColor="#f59e0b"
            iconBg="#f59e0b20"
            title="Typing Indicator"
            subtitle="Show typing status to others"
            value={typingIndicator}
            onValueChange={setTypingIndicator}
          />
          <SettingItem
            icon="lock-closed"
            iconColor="#ef4444"
            iconBg="#ef444420"
            title="Blocked Users"
            subtitle="Manage your blocked contacts"
            onPress={() =>
              Alert.alert("Blocked Users", "No blocked users at the moment")
            }
            isLast
          />
        </SettingSection>

        {/* Data & Storage Section */}
        <SettingSection title="DATA & STORAGE" delay={400}>
          <ToggleItem
            icon="download"
            iconColor="#5CBFE3"
            iconBg="#5CBFE320"
            title="Auto-download Media"
            subtitle="Automatically download photos and videos"
            value={autoDownload}
            onValueChange={setAutoDownload}
          />
          <ToggleItem
            icon="arrow-down-circle"
            iconColor="#F9AD6E"
            iconBg="#F9AD6E20"
            title="Data Compression"
            subtitle="Reduce data usage with compression"
            value={dataCompression}
            onValueChange={setDataCompression}
          />
          <SettingItem
            icon="folder-open"
            iconColor="#a855f7"
            iconBg="#a855f720"
            title="Storage Usage"
            subtitle="Manage app storage and cache"
            onPress={() =>
              Alert.alert("Storage", "Total storage: 156 MB")
            }
            isLast
          />
        </SettingSection>

        {/* Account Section */}
        <SettingSection title="ACCOUNT" delay={500}>
          <SettingItem
            icon="person-circle"
            iconColor="#5CBFE3"
            iconBg="#5CBFE320"
            title="Account Information"
            subtitle="View and edit your account details"
            onPress={() => navigation.navigate("ProfileScreen")}
          />
          <SettingItem
            icon="key"
            iconColor="#14b8a6"
            iconBg="#14b8a620"
            title="Change Password"
            subtitle="Update your account password"
            onPress={() =>
              Alert.alert("Change Password", "Feature coming soon!")
            }
          />
          <SettingItem
            icon="shield-checkmark"
            iconColor="#10b981"
            iconBg="#10b98120"
            title="Two-Factor Authentication"
            subtitle="Add extra security to your account"
            onPress={() => Alert.alert("2FA", "Feature coming soon!")}
            isLast
          />
        </SettingSection>

        {/* Support Section */}
        <SettingSection title="SUPPORT & ABOUT" delay={600}>
          <SettingItem
            icon="help-circle"
            iconColor="#3b82f6"
            iconBg="#3b82f620"
            title="Help Center"
            subtitle="Get help and support"
            onPress={() => Alert.alert("Help", "Visit support.textie.com")}
          />
          <SettingItem
            icon="chatbubbles"
            iconColor="#8b5cf6"
            iconBg="#8b5cf620"
            title="Contact Us"
            subtitle="Send us your feedback"
            onPress={() =>
              Alert.alert("Contact", "Email: support@textie.com")
            }
          />
          <SettingItem
            icon="document-text"
            iconColor="#f59e0b"
            iconBg="#f59e0b20"
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            onPress={() =>
              Alert.alert("Privacy", "Opens privacy policy page")
            }
          />
          <SettingItem
            icon="information-circle"
            iconColor="#06b6d4"
            iconBg="#06b6d420"
            title="About Textie"
            subtitle="Version 1.0.0"
            onPress={() =>
              Alert.alert("About", "Textie - Messaging made simple")
            }
            isLast
          />
        </SettingSection>

        {/* Danger Zone */}
        <AnimatedTouchable
          entering={FadeInDown.delay(700).springify()}
          onPress={() =>
            Alert.alert(
              "Delete Account",
              "Are you sure you want to delete your account? This action cannot be undone.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive" },
              ]
            )
          }
          className="mt-2 mb-6"
          activeOpacity={0.8}
        >
          <View
            className="bg-red-50 dark:bg-red-900/20 rounded-3xl p-4 flex-row items-center"
            style={{
              borderWidth: 1,
              borderColor: "#fee2e2",
            }}
            
          >
            <Ionicons name="trash" size={24} color="#ef4444" />
            <View className="flex-1 ml-3">
              <Text className="font-bold text-red-600 text-base">
                Delete Account
              </Text>
              <Text className="text-red-500 text-sm mt-0.5">
                Permanently delete your account and data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ef4444" />
          </View>
        </AnimatedTouchable>
      </ScrollView>
    </View>
  );
}