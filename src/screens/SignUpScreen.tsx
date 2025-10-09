import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import {
  ALERT_TYPE,
  Toast,
} from "react-native-alert-notification";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import "../../global.css";
import { useTheme } from "../theme/ThemeProvider";
import { useUserRegistration } from "../components/UserContext";
import { validateFirstName, validateLastName } from "../util/Validation";
import { RootStack } from "../../App";

type SignUpProps = NativeStackNavigationProp<RootStack, "SignUpScreen">;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpProps>();
  const { applied } = useTheme();
  const { userData, setUserData } = useUserRegistration();
  
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const buttonScale = useSharedValue(1);

  const logo =
    applied === "light"
      ? require("../../assets/vertical_textie.png")
      : require("../../assets/vertical_textie.png");

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15 });
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleNext = () => {
    let validFirstName = validateFirstName(userData.firstName);
    let validLastName = validateLastName(userData.lastName);
    
    if (validFirstName) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: validFirstName,
      });
    } else if (validLastName) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: validLastName,
      });
    } else {
      navigation.navigate("ContactScreen");
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
            ? ["#f0f9ff", "#e0f2fe", "#bae6fd"]
            : ["#0f172a", "#1e293b", "#334155"]
        }
        className="absolute inset-0"
      />

      {/* Floating Decorative Circles */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(1000)}
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20"
        style={{
          backgroundColor: applied === "light" ? "#3b82f6" : "#60a5fa",
        }}
      />
      <Animated.View
        entering={FadeInDown.delay(400).duration(1000)}
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-10"
        style={{
          backgroundColor: applied === "light" ? "#8b5cf6" : "#fa9b4d",
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView className="flex-1 justify-center px-6 py-8">
            {/* Logo Section */}
            <Animated.View
              entering={FadeInDown.delay(100).springify()}
              className="items-center mb-8"
            >
              <View className="bg-white/10 rounded-3xl p-4 shadow-lg">
                <Image source={logo} className="h-32 w-36" />
              </View>
            </Animated.View>

            {/* Welcome Text */}
            <Animated.View
              entering={FadeInDown.delay(300).springify()}
              className="mb-8"
            >
              <Text
                className={`text-3xl font-bold mb-3 ${
                  applied === "light" ? "text-slate-800" : "text-white"
                }`}
              >
                Welcome! 👋
              </Text>
              <Text
                className={`text-base leading-6 ${
                  applied === "light" ? "text-slate-600" : "text-slate-300"
                }`}
              >
                Create your account and start connecting with friends today
              </Text>
            </Animated.View>

            {/* Input Fields */}
            <Animated.View
              entering={FadeInDown.delay(500).springify()}
              className="space-y-4 mb-6"
            >
              {/* First Name Input */}
              <View className="bg-white/90 rounded-2xl p-4 shadow-lg">
                <View className="flex-row items-center">
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={applied === "light" ? "#64748b" : "#94a3b8"}
                    style={{ marginRight: 12 }}
                  />
                  <View className="flex-1">
                    <FloatingLabelInput
                      label="First Name"
                      value={userData.firstName}
                      onChangeText={(text) =>
                        setUserData((previous) => ({
                          ...previous,
                          firstName: text,
                        }))
                      }
                      onFocus={() => setFirstNameFocused(true)}
                      onBlur={() => setFirstNameFocused(false)}
                      containerStyles={{
                        borderWidth: 0,
                        paddingHorizontal: 0,
                        backgroundColor: "transparent",
                      }}
                      customLabelStyles={{
                        colorFocused: applied === "light" ? "#3b82f6" : "#60a5fa",
                        colorBlurred: applied === "light" ? "#64748b" : "#94a3b8",
                        fontSizeFocused: 12,
                      }}
                      inputStyles={{
                        color: applied === "light" ? "#0f172a" : "#00000",
                        fontSize: 16,
                      }}
                    />
                  </View>
                </View>
              </View>

              {/* Last Name Input */}
              <View className="bg-white/90 rounded-2xl p-4 shadow-lg mt-4">
                <View className="flex-row items-center">
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={applied === "light" ? "#64748b" : "#94a3b8"}
                    style={{ marginRight: 12 }}
                  />
                  <View className="flex-1">
                    <FloatingLabelInput
                      label="Last Name"
                      value={userData.lastName}
                      onChangeText={(text) =>
                        setUserData((previous) => ({
                          ...previous,
                          lastName: text,
                        }))
                      }
                      onFocus={() => setLastNameFocused(true)}
                      onBlur={() => setLastNameFocused(false)}
                      containerStyles={{
                        borderWidth: 0,
                        paddingHorizontal: 0,
                        backgroundColor: "transparent",
                      }}
                      customLabelStyles={{
                        colorFocused: applied === "light" ? "#3b82f6" : "#60a5fa",
                        colorBlurred: applied === "light" ? "#64748b" : "#94a3b8",
                        fontSizeFocused: 12,
                      }}
                      inputStyles={{
                        color: applied === "light" ? "#0f172a" : "#00000",
                        fontSize: 16,
                      }}
                    />
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Next Button */}
            <Animated.View entering={FadeInDown.delay(700).springify()}>
              <AnimatedPressable
                style={buttonStyle}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleNext}
                className="overflow-hidden rounded-full shadow-xl"
              >
                <LinearGradient
                  colors={["#10b981", "#059669", "#047857"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="h-16 flex-row justify-center items-center"
                >
                  <Text className="text-white font-bold text-lg mr-2">
                    Continue
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </LinearGradient>
              </AnimatedPressable>
            </Animated.View>

            {/* Footer Text */}
            <Animated.View
              entering={FadeInDown.delay(900).springify()}
              className="mt-8"
            >
              <Text
                className={`text-center text-sm ${
                  applied === "light" ? "text-slate-500" : "text-slate-400"
                }`}
              >
                By continuing, you agree to our{" "}
                <Text className="font-semibold text-blue-500">
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text className="font-semibold text-blue-500">
                  Privacy Policy
                </Text>
              </Text>
            </Animated.View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}