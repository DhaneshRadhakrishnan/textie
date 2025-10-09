import { useEffect } from "react";
import { Image, StatusBar, Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withSpring,
    withRepeat,
    withSequence,
    Easing,
    withDelay,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import CircleShape from "../components/CircleShape";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useTheme } from "../theme/ThemeProvider";
import { useWebSocketPing } from "../socket/UseWebSocketPing";

type Props = NativeStackNavigationProp<RootStack, "SplashScreen">;

export default function SplashScreen() {
    const navigation = useNavigation<Props>();
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.8);
    const logoRotate = useSharedValue(0);
    const circleScale1 = useSharedValue(0);
    const circleScale2 = useSharedValue(0);
    const circleScale3 = useSharedValue(0);
    const shimmer = useSharedValue(-1);

    useWebSocketPing(60000);

    useEffect(() => {
        // Logo animations
        opacity.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) });
        scale.value = withSpring(1, { damping: 12, stiffness: 100 });
        logoRotate.value = withSequence(
            withTiming(5, { duration: 600 }),
            withTiming(-5, { duration: 600 }),
            withTiming(0, { duration: 600 })
        );

        // Staggered circle animations
        circleScale1.value = withDelay(200, withSpring(1, { damping: 15, stiffness: 80 }));
        circleScale2.value = withDelay(400, withSpring(1, { damping: 15, stiffness: 80 }));
        circleScale3.value = withDelay(600, withSpring(1, { damping: 15, stiffness: 80 }));

        // Shimmer effect
        shimmer.value = withRepeat(
            withTiming(1, { duration: 2000, easing: Easing.linear }),
            -1,
            false
        );

        // const timer = setTimeout(() => {
        //   navigation.replace("SignUpScreen");
        // }, 3000);

        // return () => clearTimeout(timer);
    }, [navigation]);

    const logoStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { scale: scale.value },
            { rotate: `${logoRotate.value}deg` }
        ],
    }));

    const footerStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: (1 - opacity.value) * 20 }],
    }));

    const circle1Style = useAnimatedStyle(() => ({
        transform: [{ scale: circleScale1.value }],
        opacity: circleScale1.value * 0.8,
    }));

    const circle2Style = useAnimatedStyle(() => ({
        transform: [{ scale: circleScale2.value }],
        opacity: circleScale2.value * 0.6,
    }));

    const circle3Style = useAnimatedStyle(() => ({
        transform: [{ scale: circleScale3.value }],
        opacity: circleScale3.value * 0.4,
    }));

    const shimmerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shimmer.value * 300 }],
    }));

    const { applied } = useTheme();
    const logo =
        applied === "light"
            ? require("../../assets/vertical_textie.png")
            : require("../../assets/vertical_textie.png");

    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100">
            <StatusBar hidden={true} />

            {/* Animated background circles */}
            <Animated.View style={[{ position: "absolute", top: -50, left: -20 }, circle1Style]}>
                <CircleShape
                    width={200}
                    height={200}
                    borderRadius={999}
                    className="bg-slate-900"
                />
            </Animated.View>

            <Animated.View style={[{ position: "absolute", top: -20, right: -30 }, circle2Style]}>
                <CircleShape
                    width={250}
                    height={250}
                    borderRadius={999}
                    className="bg-slate-800"
                />
            </Animated.View>

            <Animated.View style={[{ position: "absolute", bottom: -80, left: -40 }, circle3Style]}>
                <CircleShape
                    width={300}
                    height={300}
                    borderRadius={999}
                    className="bg-slate-700"
                />
            </Animated.View>

            {/* Decorative small circles */}
            <Animated.View style={[{ position: "absolute", top: 150, right: 40 }, circle2Style]}>
                <View className="w-12 h-12 rounded-full bg-slate-300 opacity-40" />
            </Animated.View>

            <Animated.View style={[{ position: "absolute", bottom: 200, left: 50 }, circle3Style]}>
                <View className="w-8 h-8 rounded-full bg-slate-400 opacity-30" />
            </Animated.View>

            {/* Logo with shimmer effect */}
            <View className="relative">
                <Animated.View style={logoStyle}>
                    <Image source={logo} style={{ height: 200, width: 220 }} />
                </Animated.View>

                {/* Shimmer overlay */}
                <Animated.View
                    style={[
                        shimmerStyle,
                        {
                            position: "absolute",
                            top: 0,
                            left: -50,
                            width: 100,
                            height: 200,
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            transform: [{ skewX: "-20deg" }],
                        }
                    ]}
                />
            </View>

            {/* Animated footer */}
            <Animated.View className="absolute bottom-10" style={footerStyle}>
                <View className="justify-center items-center px-8 py-4 bg-white/50 rounded-2xl backdrop-blur-sm">
                    <Text className="text-xs font-bold text-slate-700 tracking-wider">
                        BY: {process.env.EXPO_PUBLIC_APP_OWNER}
                    </Text>
                    <View className="w-16 h-0.5 bg-slate-400 my-2 rounded-full" />
                    <Text className="text-xs font-semibold text-slate-600">
                        VERSION {process.env.EXPO_PUBLIC_APP_VERSION}
                    </Text>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}