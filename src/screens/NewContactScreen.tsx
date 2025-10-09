import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState } from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { FloatingLabelInput } from "react-native-floating-label-input";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import {
  validateCountryCode,
  validateFirstName,
  validateLastName,
  validatePhoneNo,
} from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useSendNewContact } from "../socket/UseSendNewContact";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../theme/ThemeProvider";

type NewContactScreenProp = NativeStackNavigationProp<RootStack, "NewContactScreen">;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function NewContactScreen() {
  const navigation = useNavigation<NewContactScreenProp>();
  const { applied } = useTheme();

  const [countryCode, setCountryCode] = useState<CountryCode>("LK");
  const [country, setCountry] = useState<Country | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [callingCode, setCallingCode] = useState("+94");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");

  const buttonScale = useSharedValue(1);

  const newContact = useSendNewContact();
  const sendNewContact = newContact.sendNewContact;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15 });
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const sendData = () => {
    sendNewContact({
      id: 0,
      firstName: firstName,
      lastName: lastName,
      countryCode: callingCode,
      contactNo: phoneNo,
      createdAt: "",
      updatedAt: "",
      status: "",
    });
    setFirstName("");
    setLastName("");
    setCallingCode("+94");
    setPhoneNo("");
    Toast.show({
      type: ALERT_TYPE.SUCCESS,
      title: "Success",
      textBody: "Contact added successfully!",
    });
    navigation.goBack();
  };

  const InputField = ({
    icon,
    label,
    value,
    onChangeText,
    inputMode = "text",
    editable = true,
    delay = 0,
  }: {
    icon: string;
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    inputMode?: "text" | "tel";
    editable?: boolean;
    delay?: number;
  }) => (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      className={`rounded-2xl mb-4 ${applied === "dark" ? "bg-slate-800/50" : "bg-white"
        }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center px-4 py-2">
        <View
          className="w-11 h-11 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: "#5CBFE320" }}
        >
          <Ionicons name={icon as any} size={22} color="#5CBFE3" />
        </View>
        <View className="flex-1">
          <FloatingLabelInput
            label={label}
            value={value}
            onChangeText={onChangeText}
            inputMode={inputMode}
            editable={editable}
            containerStyles={{
              borderWidth: 0,
              paddingHorizontal: 0,
              backgroundColor: "transparent",
            }}
            customLabelStyles={{
              colorFocused: "#5CBFE3",
              colorBlurred: applied === "dark" ? "#64748b" : "#94a3b8",
              fontSizeFocused: 12,
            }}
            inputStyles={{
              color: applied === "dark" ? "#f1f5f9" : "#0f172a",
              fontSize: 16,
              fontWeight: "500",
            }}
          />
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View
      className={`flex-1 ${applied === "dark" ? "bg-slate-900" : "bg-gray-50"}`}
    >
      {/* Custom Header with Gradient */}
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
          <View className="flex-row items-center px-4 py-4">
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3"
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-white">
                New Contact
              </Text>
              <Text className="text-white/80 text-sm mt-0.5">
                Add someone to your contacts
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Placeholder */}
          <Animated.View
            entering={FadeInDown.delay(100).springify()}
            className="items-center mb-8 mt-4"
          >
            <View className="relative">
              <LinearGradient
                colors={['#5CBFE3', '#F9AD6E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  padding: 2,           // approximate p-1 in Tailwind
                  borderRadius: 9999,   // fully circular like rounded-full
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  className={`w-28 h-28 rounded-full items-center justify-center ${applied === "dark" ? "bg-slate-800" : "bg-white"
                    }`}
                >
                  <Ionicons
                    name="person-add"
                    size={48}
                    color={applied === "dark" ? "#94a3b8" : "#64748b"}
                  />
                </View>
              </LinearGradient>
            </View>
            <Text
              className={`mt-4 text-base font-semibold ${applied === "dark" ? "text-slate-300" : "text-slate-600"
                }`}
            >
              Add Contact Details
            </Text>
          </Animated.View>

          {/* Personal Information Section */}
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            className="mb-6"
          >
            <Text
              className={`text-sm font-bold mb-3 px-1 ${applied === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
            >
              PERSONAL INFORMATION
            </Text>

            <InputField
              icon="person-outline"
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              delay={300}
            />

            <InputField
              icon="person-outline"
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              delay={350}
            />
          </Animated.View>

          {/* Contact Information Section */}
          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <Text
              className={`text-sm font-bold mb-3 px-1 ${applied === "dark" ? "text-slate-400" : "text-slate-600"
                }`}
            >
              CONTACT INFORMATION
            </Text>

            {/* Country Picker */}
            <Animated.View
              entering={FadeInDown.delay(450).springify()}
              className="mb-4"
            >
              <Pressable
                onPress={() => setShow(true)}
                className={`rounded-2xl ${applied === "dark" ? "bg-slate-800/50" : "bg-white"
                  }`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center px-4 py-4">
                  <View
                    className="w-11 h-11 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: "#F9AD6E20" }}
                  >
                    <Ionicons name="globe-outline" size={22} color="#F9AD6E" />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`text-xs mb-1 ${applied === "dark" ? "text-slate-400" : "text-slate-500"
                        }`}
                    >
                      Country
                    </Text>
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
                        setCallingCode(`+${c.callingCode}`);
                        setShow(false);
                      }}
                    />
                  </View>
                  <AntDesign
                    name="down"
                    size={16}
                    color={applied === "dark" ? "#64748b" : "#94a3b8"}
                  />
                </View>
              </Pressable>
            </Animated.View>

            {/* Phone Number */}
            <Animated.View
              entering={FadeInDown.delay(500).springify()}
              className={`rounded-2xl ${applied === "dark" ? "bg-slate-800/50" : "bg-white"
                }`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center px-4 py-2">
                <View
                  className="w-11 h-11 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: "#10b98120" }}
                >
                  <Ionicons name="call-outline" size={22} color="#10b981" />
                </View>

                {/* Country Code */}
                <View
                  className="px-3 py-3 rounded-xl mr-2"
                  style={{ backgroundColor: "#5CBFE320" }}
                >
                  <Text
                    className={`font-bold ${applied === "dark" ? "text-white" : "text-slate-800"
                      }`}
                  >
                    {country ? `+${country.callingCode}` : callingCode}
                  </Text>
                </View>

                {/* Phone Input */}
                <View className="flex-1">
                  <FloatingLabelInput
                    label="Phone Number"
                    value={phoneNo}
                    onChangeText={setPhoneNo}
                    inputMode="tel"
                    containerStyles={{
                      borderWidth: 0,
                      paddingHorizontal: 0,
                      backgroundColor: "transparent",
                    }}
                    customLabelStyles={{
                      colorFocused: "#10b981",
                      colorBlurred: applied === "dark" ? "#64748b" : "#94a3b8",
                      fontSizeFocused: 12,
                    }}
                    inputStyles={{
                      color: applied === "dark" ? "#f1f5f9" : "#0f172a",
                      fontSize: 16,
                      fontWeight: "500",
                    }}
                  />
                </View>
              </View>
            </Animated.View>
          </Animated.View>

          {/* Info Box */}
          <Animated.View
            entering={FadeInDown.delay(600).springify()}
            className="mt-6 mb-4"
          >
            <View
              className="flex-row p-4 rounded-2xl"
              style={{ backgroundColor: "#5CBFE310" }}
            >
              <Ionicons
                name="information-circle"
                size={20}
                color="#5CBFE3"
                style={{ marginRight: 12, marginTop: 2 }}
              />
              <Text
                className={`flex-1 text-sm leading-5 ${applied === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}
              >
                Make sure the phone number is correct. Your contact will receive
                a notification to connect on Textie.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Save Button */}
        <View
          className={`px-5 py-4 ${applied === "dark" ? "bg-slate-800" : "bg-white"
            }`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <AnimatedPressable
            style={buttonStyle}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => {
              const firstNameValid = validateFirstName(firstName);
              const lastNameValid = validateLastName(lastName);
              const countryCodeValid = validateCountryCode(callingCode);
              const phoneNoValid = validatePhoneNo(phoneNo);

              if (firstNameValid) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: firstNameValid,
                });
              } else if (lastNameValid) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: lastNameValid,
                });
              } else if (countryCodeValid) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: countryCodeValid,
                });
              } else if (phoneNoValid) {
                Toast.show({
                  type: ALERT_TYPE.WARNING,
                  title: "Warning",
                  textBody: phoneNoValid,
                });
              } else {
                sendData();
              }
            }}
            className="overflow-hidden rounded-full"
          >
            <LinearGradient
              colors={["#5CBFE3", "#F9AD6E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="h-14 flex-row justify-center items-center"
            >
              <Ionicons name="checkmark-circle" size={24} color="white" />
              <Text className="text-white font-bold text-lg ml-2">
                Save Contact
              </Text>
            </LinearGradient>
          </AnimatedPressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}