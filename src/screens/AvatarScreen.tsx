import {
  ActivityIndicator,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useContext, useState } from "react";
import { useUserRegistration } from "../components/UserContext";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { createNewAccount } from "../api/UserService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/AuthProvider";
import { useTheme } from "../theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type AvatarScreenProps = NativeStackNavigationProp<RootStack, "AvatarScreen">;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Default user avatar - you can replace this with your own default avatar
const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/png?seed=default";

export default function AvatarScreen() {
  const navigation = useNavigation<AvatarScreenProps>();
  const { applied } = useTheme();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const { userData, setUserData } = useUserRegistration();
  const auth = useContext(AuthContext);

  const buttonScale = useSharedValue(1);
  const imageScale = useSharedValue(1);

  const logo =
    applied === "light"
      ? require("../../assets/vertical_textie.png")
      : require("../../assets/vertical_textie.png");

  const pickImage = async () => {
    // Animate image picker button
    imageScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1)
    );

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setUserData((previous) => ({
        ...previous,
        profileImage: result.assets[0].uri,
      }));
    }
  };

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15 });
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const handleCreateAccount = async () => {
    try {
      setLoading(true);

      // Use default avatar if no image selected
      const finalImage = image || DEFAULT_AVATAR;

      const updatedUserData = {
        ...userData,
        profileImage: finalImage,
      };

      const response = await createNewAccount(updatedUserData);

      if (response.status) {
        const id = response.userId;
        if (auth) {
          await auth.signUp(String(id));
          // navigation.replace("HomeScreen");
        }
      } else {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "Warning",
          textBody: response.message,
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Failed to create account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <StatusBar
        barStyle={applied === "light" ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Gradient Background */}
      <LinearGradient
        colors={
          applied === "light"
            ? ["#FFF7ED", "#FEF3C7", "#DBEAFE"]
            : ["#1e293b", "#334155", "#1e293b"]
        }
        className="absolute inset-0"
      />

      {/* Decorative Circles */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(1000)}
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20"
        style={{ backgroundColor: "#5CBFE3" }}
      />
      <Animated.View
        entering={FadeInDown.delay(300).duration(1000)}
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-15"
        style={{ backgroundColor: "#F9AD6E" }}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <SafeAreaView className="flex-1 justify-center px-6 py-8">
          {/* Logo */}
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            className="items-center mb-6"
          >
            <View className="bg-white/20 rounded-3xl p-4 shadow-lg">
              <Image source={logo} className="h-24 w-28" />
            </View>
          </Animated.View>

          {/* Header */}
          <Animated.View
            entering={FadeInDown.delay(300).springify()}
            className="mb-8"
          >
            <Text
              className={`text-3xl font-bold text-center mb-2 ${applied === "light" ? "text-slate-800" : "text-white"
                }`}
            >
              Almost There! 🎉
            </Text>
            <Text
              className={`text-center text-base ${applied === "light" ? "text-slate-600" : "text-slate-300"
                }`}
            >
              Choose a profile picture to personalize your Textie account
            </Text>
          </Animated.View>

          {/* Profile Image Section */}
          <Animated.View
            entering={FadeInDown.delay(500).springify()}
            className="items-center mb-12"
          >
            {/* Image Preview */}
            <Animated.View style={imageStyle} className="mb-6">
              <View className="relative">
                {/* Image Container with Gradient Border */}

                <View className="bg-white rounded-full p-2">
                  <Image
                    source={image ? { uri: image } : { uri: DEFAULT_AVATAR }}
                    className="h-40 w-40 rounded-full"
                  />
                </View>



                {/* Camera Button Overlay */}
                <Pressable
                  onPress={pickImage}
                  className="absolute bottom-2 right-2 w-14 h-14 rounded-full shadow-xl items-center justify-center"
                >
                  <View
                    className="w-full h-full rounded-full items-center justify-center bg-blue-300"
                  >
                    <Ionicons name="camera" size={24} color="white" />
                  </View>
                </Pressable>
              </View>
            </Animated.View>

            {/* Upload Button */}
            <Animated.View entering={FadeInDown.delay(700).springify()}>
              <Pressable
                onPress={pickImage}
                className="bg-white/90 rounded-2xl px-6 py-3 shadow-lg items-center justify-center"
              >
                <View className="flex-row items-center">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: "#5CBFE320" }}
                  >
                    <Ionicons name="images-outline" size={20} color="#5CBFE3" />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`font-semibold text-base ${applied === "light" ? "text-slate-800" : "text-slate-900"
                        }`}
                    >
                      {image ? "Change Photo" : "Upload Photo"}
                    </Text>
                    <Text className="text-xs text-slate-500">
                      Choose from gallery
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                </View>
              </Pressable>
            </Animated.View>

            {/* Info Text */}
            {!image && (
              <Animated.View
                entering={FadeInDown.delay(900).springify()}
                className="mt-6 px-6"
              >
                <View className="w-full px-6 mt-6">
                  <View
                    className="flex-row items-center rounded-xl mt-4 p-3"
                    style={{
                      backgroundColor:
                        applied === "light"
                          ? "rgba(249, 173, 110, 0.15)"
                          : "rgba(249, 173, 110, 0.25)",
                    }}
                  >
                    <Ionicons
                      name="information-circle"
                      size={22}
                      color="#F9AD6E"
                      style={{ marginRight: 10 }}
                    />
                    <Text
                      className="text-sm text-slate-100"
                      numberOfLines={2}
                    >
                      Don't worry! A default avatar will be used if you skip this step.
                    </Text>
                  </View>
                </View>

              </Animated.View>
            )}
          </Animated.View>

          {/* Create Account Button */}
          <Animated.View entering={FadeInDown.delay(1100).springify()}>
            <AnimatedPressable
              style={buttonStyle}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleCreateAccount}
              disabled={loading}
              className="overflow-hidden rounded-full shadow-xl"
            >
              <LinearGradient
                colors={
                  loading
                    ? ["#94a3b8", "#cbd5e1"]
                    : ["#5CBFE3", "#F9AD6E"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="h-16 flex-row justify-center items-center"
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Text className="text-white font-bold text-lg mr-2">
                      Create My Account
                    </Text>
                    <Ionicons name="checkmark-circle" size={24} color="white" />
                  </>
                )}
              </LinearGradient>
            </AnimatedPressable>
          </Animated.View>

          {/* Skip Option */}
          <Animated.View
            entering={FadeInDown.delay(1300).springify()}
            className="mt-4"
          >
            <Pressable
              onPress={handleCreateAccount}
              disabled={loading}
              className="py-3"
            >
              <Text
                className={`text-center font-semibold ${applied === "light" ? "text-slate-600" : "text-slate-400"
                  }`}
              >
                Skip for now
              </Text>
            </Pressable>
          </Animated.View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}