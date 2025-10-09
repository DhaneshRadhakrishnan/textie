import { AntDesign, Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useUserRegistration } from "../components/UserContext";
import {
  ALERT_TYPE,
  Toast,
} from "react-native-alert-notification";
import { validateCountryCode, validatePhoneNo } from "../util/Validation";
import { useTheme } from "../theme/ThemeProvider";

type ContactProps = NativeStackNavigationProp<RootStack, "ContactScreen">;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ContactScreen() {
  const navigation = useNavigation<ContactProps>();
  const { applied } = useTheme();

  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [phoneNoFocused, setPhoneNoFocused] = useState(false);

  const { userData, setUserData } = useUserRegistration();
  const [callingCode, setCallingCode] = useState("+94");
  const [phoneNo, setPhoneNo] = useState("");

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
    const validCountryCode = validateCountryCode(callingCode);
    const validPhoneNo = validatePhoneNo(phoneNo);

    if (validCountryCode) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: validCountryCode,
      });
    } else if (validPhoneNo) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: validPhoneNo,
      });
    } else {
      setUserData((previous) => ({
        ...previous,
        countryCode: country ? `+${country.callingCode}` : callingCode,
        contactNo: phoneNo,
      }));
      navigation.replace("AvatarScreen");
    }
  };

  return (
    <View className="flex-1">
      <StatusBar
        barStyle={applied === "light" ? "dark-content" : "light-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Gradient Background with Textie Brand Colors */}
      <LinearGradient
        colors={
          applied === "light"
            ? ["#FFF7ED", "#FEF3C7", "#DBEAFE"]
            : ["#1e293b", "#334155", "#1e293b"]
        }
        className="absolute inset-0"
      />

      {/* Decorative Elements with Brand Colors */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(1000)}
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20"
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
              className="items-center mb-6"
            >
              <View className="bg-white/20 rounded-3xl p-4 shadow-lg">
                <Image source={logo} className="h-28 w-32" />
              </View>
            </Animated.View>

            {/* Header Section */}
            <Animated.View
              entering={FadeInDown.delay(300).springify()}
              className="mb-8"
            >
              <View className="flex-row items-center mb-3">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: "#5CBFE3" }}
                >
                  <Ionicons name="call" size={24} color="white" />
                </View>
                <Text
                  className={`text-3xl font-bold ${
                    applied === "light" ? "text-slate-800" : "text-white"
                  }`}
                >
                  Your Number
                </Text>
              </View>
              <View
                className="p-4 rounded-2xl"
                style={{ backgroundColor: "rgba(92, 191, 227, 0.1)" }}
              >
                <Text
                  className={`text-sm leading-6 ${
                    applied === "light" ? "text-slate-700" : "text-slate-300"
                  }`}
                >
                  🔒 We use your contacts to help you find friends who are
                  already on Textie. Your contacts stay completely private and
                  secure.
                </Text>
              </View>
            </Animated.View>

            {/* Country Picker Section */}
            <Animated.View
              entering={FadeInDown.delay(500).springify()}
              className="mb-4"
            >
              <Text
                className={`text-sm font-semibold mb-2 ml-1 ${
                  applied === "light" ? "text-slate-600" : "text-slate-400"
                }`}
              >
                SELECT COUNTRY
              </Text>
              <Pressable
                onPress={() => setShow(true)}
                className="bg-white/90 rounded-2xl shadow-lg overflow-hidden"
              >
                <View className="flex-row items-center p-4">
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: "#F9AD6E20" }}
                  >
                    <Ionicons
                      name="globe-outline"
                      size={20}
                      color="#F9AD6E"
                    />
                  </View>
                  <View className="flex-1">
                    <CountryPicker
                      countryCode={countryCode}
                      withFilter
                      withFlag
                      withCountryNameButton
                      withCallingCode
                      visible={show}
                      onClose={() => setShow(false)}
                      onSelect={(c) => {
                        setCountryCode(c.cca2);
                        setCountry(c);
                        setShow(false);
                      }}
                    />
                  </View>
                  <AntDesign
                    name="down"
                    size={16}
                    color={applied === "light" ? "#64748b" : "#94a3b8"}
                  />
                </View>
              </Pressable>
            </Animated.View>

            {/* Phone Number Input */}
            <Animated.View
              entering={FadeInDown.delay(700).springify()}
              className="mb-8"
            >
              <Text
                className={`text-sm font-semibold mb-2 ml-1 ${
                  applied === "light" ? "text-slate-600" : "text-slate-400"
                }`}
              >
                PHONE NUMBER
              </Text>
              <View className="bg-white/90 rounded-2xl shadow-lg overflow-hidden">
                <View className="flex-row items-center p-2">
                  {/* Country Code Input */}
                  <View
                    className="flex-row items-center px-3 py-3 rounded-xl mr-2"
                    style={{ backgroundColor: "#5CBFE320" }}
                  >
                    <Ionicons name="flag" size={18} color="#5CBFE3" />
                    <TextInput
                      inputMode="tel"
                      className="font-bold text-base ml-2"
                      style={{
                        color: applied === "light" ? "#0f172a" : "#000000",
                        width: 50,
                      }}
                      editable={false}
                      value={country ? `+${country.callingCode}` : callingCode}
                    />
                  </View>

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
                        color: applied === "light" ? "#0f172a" : "#000000",
                      }}
                      placeholder=""
                      placeholderTextColor="#94a3b8"
                      value={phoneNo}
                      onChangeText={setPhoneNo}
                      onFocus={() => setPhoneNoFocused(true)}
                      onBlur={() => setPhoneNoFocused(false)}
                    />
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Next Button with Brand Gradient */}
            <Animated.View entering={FadeInDown.delay(900).springify()}>
              <AnimatedPressable
                style={buttonStyle}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleNext}
                className="overflow-hidden rounded-full shadow-xl"
              >
                <LinearGradient
                  colors={["#5CBFE3", "#F9AD6E"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="h-16 flex-row justify-center items-center"
                >
                  <Text className="text-white font-bold text-lg mr-2">
                    Continue to Textie
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </LinearGradient>
              </AnimatedPressable>
            </Animated.View>

            {/* Privacy Note */}
            <Animated.View
              entering={FadeInDown.delay(1100).springify()}
              className="mt-6"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons
                  name="shield-checkmark"
                  size={16}
                  color="#10b981"
                  style={{ marginRight: 6 }}
                />
                <Text
                  className={`text-xs ${
                    applied === "light" ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Your privacy is protected by end-to-end encryption
                </Text>
              </View>
            </Animated.View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}