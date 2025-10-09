import {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSingleChat } from "../socket/UseSingleChat";
import { Chat } from "../socket/chat";
import { formatChatTime } from "../util/DateFormatter";
import { useSendChat } from "../socket/UseSendChat";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInRight,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../theme/ThemeProvider";

type SingleChatScreenProps = NativeStackScreenProps<
  RootStack,
  "SingleChatScreen"
>;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function SingleChatScreen({
  route,
  navigation,
}: SingleChatScreenProps) {
  const { chatId, friendName, lastSeenTime, profileImage } = route.params;
  const singleChat = useSingleChat(chatId);
  const messages = singleChat.messages;
  const friend = singleChat.friend;
  const sendMessage = useSendChat();
  const { applied } = useTheme();

  const [input, setInput] = useState("");
  const sendButtonScale = useSharedValue(1);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation, friend]);

  const sendButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendButtonScale.value }],
  }));

  const handleSendChat = () => {
    if (!input.trim()) {
      return;
    }

    sendButtonScale.value = withSpring(0.8, { damping: 15 });
    setTimeout(() => {
      sendButtonScale.value = withSpring(1, { damping: 15 });
    }, 150);

    sendMessage(chatId, input);
    setInput("");
  };

  const renderItem = ({ item, index }: { item: Chat; index: number }) => {
    const isMe = item.from.id !== chatId;

    return (
      <Animated.View
        entering={SlideInRight.delay(index * 20).springify()}
        className={`my-1.5 px-4 ${isMe ? "items-end" : "items-start"}`}
      >
        <View
          className={`max-w-[80%] rounded-3xl overflow-hidden ${isMe ? "rounded-br-md" : "rounded-bl-md"
            }`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          {isMe ? (
            <LinearGradient
              colors={["#5CBFE3", "#7EC8E8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="px-4 py-3"
            >
              <Text className="text-white text-base leading-5">
                {item.message}
              </Text>
              <View className="flex-row justify-end items-center mt-1.5">
                <Text className="text-white/80 text-xs mr-1.5">
                  {formatChatTime(item.createdAt)}
                </Text>
                <Ionicons
                  name={
                    item.status === "READ"
                      ? "checkmark-done"
                      : item.status === "DELIVERED"
                        ? "checkmark-done"
                        : "checkmark"
                  }
                  size={16}
                  color={item.status === "READ" ? "#FFF" : "rgba(255,255,255,0.7)"}
                />
              </View>
            </LinearGradient>
          ) : (
            <View
              className={`px-4 py-3 ${applied === "dark" ? "bg-slate-700" : "bg-white"
                }`}
            >
              <Text
                className={`text-base leading-5 ${applied === "dark" ? "text-white" : "text-slate-800"
                  }`}
              >
                {item.message}
              </Text>
              <Text
                className={`text-xs mt-1.5 ${applied === "dark" ? "text-slate-400" : "text-slate-500"
                  }`}
              >
                {formatChatTime(item.createdAt)}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <View
      className={`flex-1 ${applied === "dark" ? "bg-slate-900" : "bg-gray-50"
        }`}
    >
      <StatusBar
        barStyle={applied === "dark" ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

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
          <View className="flex-row items-center justify-between px-4 py-3">
            {/* Left Section */}
            <View className="flex-row items-center flex-1">
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3"
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>

              <Pressable
                className="flex-row items-center flex-1"
                onPress={() => {
                  // Navigate to friend profile
                }}
              >
                <View className="relative">
                  <LinearGradient
                    colors={["#F9AD6E", "#5CBFE3"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      padding: 2,             // similar to p-0.5
                      borderRadius: 9999,     // ensures it's fully round
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View className="bg-white rounded-full p-0.5">
                      <Image
                        source={{ uri: profileImage }}
                        className="h-11 w-11 rounded-full"
                      />
                    </View>
                  </LinearGradient>
                  {friend?.status === "ONLINE" && (
                    <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </View>

                <View className="ml-3 flex-1">
                  <Text className="font-bold text-lg text-white" numberOfLines={1}>
                    {friend
                      ? friend.firstName + " " + friend.lastName
                      : friendName}
                  </Text>
                  <Text className="text-xs text-white/80" numberOfLines={1}>
                    {friend?.status === "ONLINE"
                      ? "Online"
                      : `Last seen ${formatChatTime(friend?.updatedAt ?? "")}`}
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* Right Section */}
            <View className="flex-row gap-2">
              <TouchableOpacity className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                <Ionicons name="call-outline" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                <Ionicons name="ellipsis-vertical" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Chat Messages */}
      <KeyboardAvoidingView
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {messages.length === 0 ? (
          <View className="flex-1 justify-center items-center px-8">
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: "#5CBFE320" }}
            >
              <Ionicons name="chatbubbles-outline" size={48} color="#5CBFE3" />
            </View>
            <Text
              className={`text-xl font-bold mb-2 ${applied === "dark" ? "text-white" : "text-slate-800"
                }`}
            >
              Start a conversation
            </Text>
            <Text
              className={`text-center ${applied === "dark" ? "text-slate-400" : "text-slate-500"
                }`}
            >
              Send a message to begin chatting with{" "}
              {friend ? friend.firstName : friendName}
            </Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderItem}
            className="flex-1"
            inverted
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 8 }}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Input Area */}
        <View
          className={`px-4 py-3 ${applied === "dark" ? "bg-slate-800" : "bg-white"
            }`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <View className="flex-row items-end gap-2">
            {/* Attachment Button */}
            <TouchableOpacity
              className={`w-11 h-11 rounded-full items-center justify-center ${applied === "dark" ? "bg-slate-700" : "bg-gray-100"
                }`}
            >
              <Ionicons
                name="add"
                size={24}
                color={applied === "dark" ? "#94a3b8" : "#64748b"}
              />
            </TouchableOpacity>

            {/* Text Input */}
            <View
              className={`flex-1 rounded-3xl px-5 py-2 ${applied === "dark" ? "bg-slate-700" : "bg-gray-100"
                }`}
            >
              <TextInput
                value={input}
                onChangeText={setInput}
                multiline
                placeholder="Type a message..."
                placeholderTextColor={applied === "dark" ? "#64748b" : "#94a3b8"}
                className={`min-h-[40px] max-h-32 text-base ${applied === "dark" ? "text-white" : "text-slate-800"
                  }`}
              />
            </View>

            {/* Send Button */}
            <AnimatedTouchable
              style={sendButtonStyle}
              onPress={handleSendChat}
              disabled={!input.trim()}
              className="w-11 h-11 rounded-full items-center justify-center overflow-hidden"
            >
              <LinearGradient
                colors={
                  input.trim()
                    ? ["#5CBFE3", "#F9AD6E"]
                    : ["#cbd5e1", "#cbd5e1"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-full h-full items-center justify-center"
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={input.trim() ? "white" : "#94a3b8"}
                />
              </LinearGradient>
            </AnimatedTouchable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}