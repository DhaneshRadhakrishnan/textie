import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useContext, useLayoutEffect, useState } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useUserProfile } from "../socket/UseUserProfile";
import { uploadProfileImage } from "../api/UserService";
import { AuthContext } from "../components/AuthProvider";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";

type ProfileScreenProp = NativeStackNavigationProp<RootStack, "ProfileScreen">;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenProp>();
  const { applied } = useTheme();
  const userProfile = useUserProfile();
  const auth = useContext(AuthContext);

  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const imageScale = useSharedValue(1);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation, applied]);

  const pickImage = async () => {
    imageScale.value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      imageScale.value = withSpring(1, { damping: 15 });
    }, 200);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setUploading(true);
      try {
        await uploadProfileImage(
          String(auth ? auth.userId : 0),
          result.assets[0].uri
        );
        Alert.alert("Success", "Profile picture updated successfully!");
      } catch (error) {
        Alert.alert("Error", "Failed to upload profile picture");
        setImage(null);
      } finally {
        setUploading(false);
      }
    }
  };

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const InfoCard = ({
    icon,
    iconColor,
    iconBg,
    label,
    value,
    delay = 0,
  }: {
    icon: string;
    iconColor: string;
    iconBg: string;
    label: string;
    value: string;
    delay?: number;
  }) => (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      className={`rounded-3xl p-5 mb-4 ${applied === "dark" ? "bg-slate-800/50" : "bg-white"
        }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      <View className="flex-row items-center mb-3">
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: iconBg }}
        >
          <Ionicons name={icon as any} size={24} color={iconColor} />
        </View>
        <Text
          className={`text-sm font-semibold ${applied === "dark" ? "text-slate-400" : "text-slate-500"
            }`}
        >
          {label}
        </Text>
      </View>
      <Text
        className={`text-xl font-bold ml-1 ${applied === "dark" ? "text-white" : "text-slate-800"
          }`}
      >
        {value}
      </Text>
    </Animated.View>
  );

  const ActionButton = ({
    icon,
    label,
    onPress,
    gradient = false,
    delay = 0,
  }: {
    icon: string;
    label: string;
    onPress: () => void;
    gradient?: boolean;
    delay?: number;
  }) => (
    <AnimatedTouchable
      entering={FadeInDown.delay(delay).springify()}
      onPress={onPress}
      className="flex-1 overflow-hidden rounded-2xl"
      activeOpacity={0.8}
    >
      {gradient ? (
        <LinearGradient
          colors={["#5CBFE3", "#F9AD6E"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="py-4 px-4 flex-row items-center justify-center"
        >
          <Ionicons name={icon as any} size={20} color="white" />
          <Text className="text-white font-bold ml-2">{label}</Text>
        </LinearGradient>
      ) : (
        <View
          className={`py-4 px-4 flex-row items-center justify-center ${applied === "dark" ? "bg-slate-800/50" : "bg-white"
            }`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Ionicons
            name={icon as any}
            size={20}
            color={applied === "dark" ? "#94a3b8" : "#64748b"}
          />
          <Text
            className={`font-bold ml-2 ${applied === "dark" ? "text-slate-300" : "text-slate-700"
              }`}
          >
            {label}
          </Text>
        </View>
      )}
    </AnimatedTouchable>
  );

  return (
    <View
      className={`flex-1 ${applied === "dark" ? "bg-slate-900" : "bg-gray-50"}`}
    >
      {/* Header with Gradient */}
      <LinearGradient
        colors={
          applied === "dark"
            ? ["#1e293b", "#334155", "transparent"]
            : ["#5CBFE3", "#7EC8E8", "transparent"]
        }
        locations={[0, 0.6, 1]}
        className="absolute top-0 left-0 right-0 h-[420px]"
      />

      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Custom Header */}
        <View className="flex-row items-center justify-between px-5 py-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">My Profile</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("SettingScreen")}
            className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Profile Image Section */}
          <Animated.View
            entering={FadeInUp.delay(100).springify()}
            className="items-center mt-8 mb-6"
          >
            <Animated.View style={imageStyle}>
              {/* Profile Image with Gradient Border */}
              <View className="relative">
                <LinearGradient
                  colors={["#5CBFE3", "#F9AD6E"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    padding: 3,          // similar to Tailwind p-1.5
                    borderRadius: 9999,  // ensures perfect circular edges
                    alignItems: "center",
                    justifyContent: "center",
                  }}

                >
                  <View className="bg-white rounded-full p-1.5">
                    {uploading ? (
                      <View className="w-36 h-36 rounded-full bg-gray-200 items-center justify-center">
                        <ActivityIndicator size="large" color="#5CBFE3" />
                      </View>
                    ) : (
                      <Image
                        className="w-36 h-36 rounded-full"
                        source={{
                          uri:
                            image ||
                            userProfile?.profileImage ||
                            `https://ui-avatars.com/api/?name=${userProfile?.firstName}+${userProfile?.lastName}&background=random`,
                        }}
                      />
                    )}
                  </View>
                </LinearGradient>

                {/* Edit Button */}
                <TouchableOpacity
                  onPress={pickImage}
                  disabled={uploading}
                  className="absolute bottom-2 right-2 w-12 h-12 rounded-full shadow-lg"
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#5CBFE3', '#F9AD6E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 9999, // for full rounded effect
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="camera" size={20} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* User Name */}
            <Animated.View
              entering={FadeInDown.delay(200).springify()}
              className="items-center mt-6"
            >
              <Text
                className={`text-3xl font-bold ${applied === "dark" ? "text-white" : "text-white"
                  }`}
              >
                {userProfile?.firstName} {userProfile?.lastName}
              </Text>
              <View className="flex-row items-center mt-2 bg-white/20 px-4 py-2 rounded-full">
                <View className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                <Text className="text-white/90 font-medium">Active Now</Text>
              </View>
            </Animated.View>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            entering={FadeInDown.delay(300).springify()}
            className="flex-row gap-3 px-5 mb-6"
          >
            <ActionButton
              icon="create-outline"
              label="Edit Profile"
              onPress={pickImage}
              gradient
            />
            <ActionButton
              icon="share-outline"
              label="Share"
              onPress={() => Alert.alert("Share", "Share profile feature")}
            />
          </Animated.View>

          {/* Info Cards */}
          <View className="px-5">
            <InfoCard
              icon="person"
              iconColor="#5CBFE3"
              iconBg="#5CBFE320"
              label="Full Name"
              value={`${userProfile?.firstName} ${userProfile?.lastName}`}
              delay={400}
            />

            <InfoCard
              icon="call"
              iconColor="#F9AD6E"
              iconBg="#F9AD6E20"
              label="Phone Number"
              value={`${userProfile?.countryCode} ${userProfile?.contactNo}`}
              delay={500}
            />

            <InfoCard
              icon="mail"
              iconColor="#8b5cf6"
              iconBg="#8b5cf620"
              label="User ID"
              value={`@${userProfile?.firstName?.toLowerCase()}${userProfile?.lastName?.toLowerCase()}`}
              delay={600}
            />

            <InfoCard
              icon="time"
              iconColor="#10b981"
              iconBg="#10b98120"
              label="Member Since"
              value="October 2024"
              delay={700}
            />
          </View>

          {/* Stats Section */}
          <Animated.View
            entering={FadeInDown.delay(800).springify()}
            className="mx-5 mt-4"
          >
            <Text
              className={`text-sm font-bold mb-3 px-1 ${applied === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
            >
              ACTIVITY STATS
            </Text>
            <View
              className={`rounded-3xl p-5 ${applied === "dark" ? "bg-slate-800/50" : "bg-white"
                }`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              <View className="flex-row justify-around">
                <View className="items-center">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-2"
                    style={{ backgroundColor: "#5CBFE320" }}
                  >
                    <Text className="text-2xl font-bold text-[#5CBFE3]">
                      247
                    </Text>
                  </View>
                  <Text
                    className={`text-sm font-semibold ${applied === "dark" ? "text-slate-400" : "text-slate-600"
                      }`}
                  >
                    Messages
                  </Text>
                </View>

                <View className="items-center">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-2"
                    style={{ backgroundColor: "#F9AD6E20" }}
                  >
                    <Text className="text-2xl font-bold text-[#F9AD6E]">
                      42
                    </Text>
                  </View>
                  <Text
                    className={`text-sm font-semibold ${applied === "dark" ? "text-slate-400" : "text-slate-600"
                      }`}
                  >
                    Contacts
                  </Text>
                </View>

                <View className="items-center">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-2"
                    style={{ backgroundColor: "#8b5cf620" }}
                  >
                    <Text className="text-2xl font-bold text-[#8b5cf6]">
                      18
                    </Text>
                  </View>
                  <Text
                    className={`text-sm font-semibold ${applied === "dark" ? "text-slate-400" : "text-slate-600"
                      }`}
                  >
                    Groups
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Additional Actions */}
          <Animated.View
            entering={FadeInDown.delay(900).springify()}
            className="mx-5 mt-6"
          >
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "QR Code",
                  "Show your QR code for others to scan and add you"
                )
              }
              className="overflow-hidden rounded-3xl"
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#5CBFE3", "#F9AD6E"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-5 flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <View className="w-14 h-14 rounded-full bg-white/30 items-center justify-center mr-4">
                    <Ionicons name="qr-code" size={28} color="white" />
                  </View>
                  <View>
                    <Text className="text-white font-bold text-lg">
                      My QR Code
                    </Text>
                    <Text className="text-white/80 text-sm">
                      Share with friends to connect
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}