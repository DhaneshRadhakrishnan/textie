import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../theme/ThemeProvider";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import "../../global.css";

type SignInProps = NativeStackNavigationProp<RootStack, "SignInScreen">;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function SignInScreen() {
  const navigation = useNavigation<SignInProps>();
  const { applied } = useTheme();

  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [callingCode, setCallingCode] = useState("+94");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNoFocused, setPhoneNoFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const buttonScale = useSharedValue(1);
  const logoScale = useSharedValue(1);

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

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const handleSignIn = () => {
    if (!phoneNo.trim()) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: "Please enter your phone number",
      });
      return;
    }
    if (!password.trim()) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: "Please enter your password",
      });
      return;
    }

    // Add your sign-in logic here
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: "Success",
      textBody: "Signing in...",
    });

    // Navigate to home or handle authentication
    // navigation.replace("HomeScreen");
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
            : ["#0f172a", "#1e293b", "#334155"]
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
        className="absolute top-40 -left-32 w-64 h-64 rounded-full opacity-15"
        style={{ backgroundColor: "#F9AD6E" }}
      />
      <Animated.View
        entering={FadeInUp.delay(500).duration(1000)}
        className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-10"
        style={{ backgroundColor: "#5CBFE3" }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
              style={logoStyle}
              entering={FadeInDown.delay(100).springify()}
              className="items-center mb-8"
            >
              <View className="bg-white/20 rounded-3xl p-4 shadow-lg">
                <Image source={logo} className="h-32 w-36" />
              </View>
            </Animated.View>

            {/* Welcome Text */}
            <Animated.View
              entering={FadeInDown.delay(300).springify()}
              className="mb-8"
            >
              <Text
                className={`text-4xl font-bold mb-3 ${
                  applied === "light" ? "text-slate-800" : "text-white"
                }`}
              >
                Welcome Back! 👋
              </Text>
              <Text
                className={`text-base leading-6 ${
                  applied === "light" ? "text-slate-600" : "text-slate-300"
                }`}
              >
                Sign in to continue chatting with your friends
              </Text>
            </Animated.View>

            {/* Input Fields */}
            <Animated.View
              entering={FadeInDown.delay(500).springify()}
              className="space-y-4 mb-6"
            >
              {/* Phone Number Section */}
              <View>
                <Text
                  className={`text-sm font-semibold mb-2 ml-1 ${
                    applied === "light" ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  PHONE NUMBER
                </Text>
                <View className="bg-white/90 rounded-2xl shadow-lg overflow-hidden">
                  <View className="flex-row items-center p-2">
                    {/* Country Code Picker */}
                    <Pressable
                      onPress={() => setShowCountryPicker(true)}
                      className="flex-row items-center px-3 py-3 rounded-xl mr-2"
                      style={{ backgroundColor: "#5CBFE320" }}
                    >
                      <Ionicons name="flag" size={18} color="#5CBFE3" />
                      <Text
                        className="font-bold text-base ml-2"
                        style={{
                          color: applied === "light" ? "#0f172a" : "#0f172a",
                        }}
                      >
                        {country ? `+${country.callingCode}` : callingCode}
                      </Text>
                      <AntDesign
                        name="down"
                        size={12}
                        color="#5CBFE3"
                        style={{ marginLeft: 4 }}
                      />
                    </Pressable>

                    <CountryPicker
                      countryCode={countryCode}
                      withFilter
                      withFlag
                      withCallingCode
                      visible={showCountryPicker}
                      onClose={() => setShowCountryPicker(false)}
                      onSelect={(c) => {
                        setCountryCode(c.cca2);
                        setCountry(c);
                        setCallingCode(`+${c.callingCode}`);
                        setShowCountryPicker(false);
                      }}
                    />

                    {/* Phone Number Input */}
                    <View className="flex-1 flex-row items-center">
                      <Ionicons
                        name="call-outline"
                        size={20}
                        color={phoneNoFocused ? "#5CBFE3" : "#94a3b8"}
                        style={{ marginRight: 8 }}
                      />
                      <TextInput
                        inputMode="tel"
                        className="flex-1 font-semibold text-base py-3"
                        style={{
                          color: applied === "light" ? "#0f172a" : "#0f172a",
                        }}
                        placeholder="70 0000 000"
                        placeholderTextColor="#94a3b8"
                        value={phoneNo}
                        onChangeText={setPhoneNo}
                        onFocus={() => setPhoneNoFocused(true)}
                        onBlur={() => setPhoneNoFocused(false)}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Password Input */}
              <View className="mt-4">
                <Text
                  className={`text-sm font-semibold mb-2 ml-1 ${
                    applied === "light" ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  PASSWORD
                </Text>
                <View className="bg-white/90 rounded-2xl shadow-lg">
                  <View className="flex-row items-center px-4 py-2">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: "#F9AD6E20" }}
                    >
                      <Ionicons name="lock-closed" size={20} color="#F9AD6E" />
                    </View>
                    <TextInput
                      className="flex-1 font-semibold text-base py-3"
                      style={{
                        color: applied === "light" ? "#0f172a" : "#0f172a",
                      }}
                      placeholder="Enter your password"
                      placeholderTextColor="#94a3b8"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      className="p-2"
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={22}
                        color="#94a3b8"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Forgot Password */}
            <Animated.View
              entering={FadeInDown.delay(700).springify()}
              className="items-end mb-6"
            >
              <TouchableOpacity>
                <Text className="font-semibold text-[#5CBFE3]">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Sign In Button */}
            <Animated.View entering={FadeInDown.delay(900).springify()}>
              <AnimatedPressable
                style={buttonStyle}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleSignIn}
                className="overflow-hidden rounded-full shadow-xl"
              >
                <LinearGradient
                  colors={["#5CBFE3", "#F9AD6E"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="h-16 flex-row justify-center items-center"
                >
                  <Text className="text-white font-bold text-lg mr-2">
                    Sign In
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </LinearGradient>
              </AnimatedPressable>
            </Animated.View>

            {/* Divider */}
            <Animated.View
              entering={FadeInDown.delay(1100).springify()}
              className="flex-row items-center my-8"
            >
              <View
                className="flex-1 h-px"
                style={{
                  backgroundColor:
                    applied === "light" ? "#e2e8f0" : "#334155",
                }}
              />
              <Text
                className={`mx-4 font-semibold ${
                  applied === "light" ? "text-slate-500" : "text-slate-400"
                }`}
              >
                OR
              </Text>
              <View
                className="flex-1 h-px"
                style={{
                  backgroundColor:
                    applied === "light" ? "#e2e8f0" : "#334155",
                }}
              />
            </Animated.View>

            {/* Social Sign In Options */}
            <Animated.View
              entering={FadeInDown.delay(1300).springify()}
              className="flex-row gap-4 mb-8"
            >
              <TouchableOpacity
                className="flex-1 bg-white/90 rounded-2xl py-4 shadow-lg"
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="logo-google" size={24} color="#EA4335" />
                  <Text className="ml-2 font-semibold text-slate-800">
                    Google
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-white/90 rounded-2xl py-4 shadow-lg"
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="logo-apple" size={24} color="#000000" />
                  <Text className="ml-2 font-semibold text-slate-800">
                    Apple
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Sign Up Link */}
            <Animated.View
              entering={FadeInDown.delay(1500).springify()}
              className="flex-row justify-center"
            >
              <Text
                className={`${
                  applied === "light" ? "text-slate-600" : "text-slate-400"
                }`}
              >
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("SignUpScreen")}
              >
                <Text className="font-bold text-[#ffa648]">Sign Up</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Privacy Text */}
            <Animated.View
              entering={FadeInDown.delay(1700).springify()}
              className="mt-8"
            >
              <Text
                className={`text-center text-xs ${
                  applied === "light" ? "text-slate-500" : "text-slate-400"
                }`}
              >
                By signing in, you agree to our{" "}
                <Text className="font-semibold text-[#ff9e37]">
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text className="font-semibold text-[#ff9e37]">
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