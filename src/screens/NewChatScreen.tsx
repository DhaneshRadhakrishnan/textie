import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { User } from "../socket/chat";
import { useUserList } from "../socket/UseUserList";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInRight,
  SlideInRight,
} from "react-native-reanimated";
import { useTheme } from "../theme/ThemeProvider";

type NewChatScreenProp = NativeStackNavigationProp<RootStack, "NewChatScreen">;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function NewChatScreen() {
  const navigation = useNavigation<NewChatScreenProp>();
  const [search, setSearch] = useState("");
  const users = useUserList();
  const { applied } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation, users]);

  const renderItem = ({ item, index }: { item: User; index: number }) => (
    <AnimatedTouchable
      entering={SlideInRight.delay(index * 30).springify()}
      className={`flex-row items-center px-4 py-3 mx-3 my-1 rounded-2xl ${
        applied === "dark" ? "bg-slate-800/50" : "bg-white"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
      onPress={() => {
        navigation.replace("SingleChatScreen", {
          chatId: item.id,
          friendName: `${item.firstName} ${item.lastName}`,
          lastSeenTime: item.updatedAt,
          profileImage: item.profileImage
            ? item.profileImage
            : `https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}&background=random`,
        });
      }}
      activeOpacity={0.7}
    >
      {/* Profile Image with Gradient Border */}
      <View className="mr-3">
        <LinearGradient
          colors={["#5CBFE3", "#F9AD6E"]}
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
              source={{
                uri: item.profileImage
                  ? item.profileImage
                  : `https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}&background=random`,
              }}
              className="h-14 w-14 rounded-full"
            />
          </View>
        </LinearGradient>
        
        {/* Online Status Badge */}
        {item.status === "ONLINE" && (
          <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        )}
      </View>

      {/* User Info */}
      <View className="flex-1">
        <Text
          className={`font-bold text-lg mb-1 ${
            applied === "dark" ? "text-white" : "text-slate-800"
          }`}
          numberOfLines={1}
        >
          {item.firstName} {item.lastName}
        </Text>
        <View className="flex-row items-center">
          {item.status === "ACTIVE" ? (
            <View
              className="flex-row items-center px-2 py-1 rounded-full"
              style={{ backgroundColor: "#5CBFE320" }}
            >
              <View className="w-1.5 h-1.5 rounded-full bg-[#5CBFE3] mr-1.5" />
              <Text className="text-xs font-semibold text-[#5CBFE3]">
                Friend
              </Text>
            </View>
          ) : (
            <Text
              className={`text-sm ${
                applied === "dark" ? "text-slate-400" : "text-slate-500"
              }`}
              numberOfLines={1}
            >
              Hey there! I am using Textie
            </Text>
          )}
        </View>
      </View>

      {/* Arrow Icon */}
      <Ionicons
        name="chevron-forward"
        size={20}
        color={applied === "dark" ? "#64748b" : "#94a3b8"}
      />
    </AnimatedTouchable>
  );

  const filteredUsers = [...users]
    .filter((user) => {
      return (
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.contactNo.includes(search)
      );
    })
    .sort((a, b) => a.firstName.localeCompare(b.firstName));

  return (
    <View
      className={`flex-1 ${applied === "dark" ? "bg-slate-900" : "bg-gray-50"}`}
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
          <View className="flex-row items-center justify-between px-4 py-4">
            <View className="flex-row items-center flex-1">
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3"
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <View>
                <Text className="text-2xl font-bold text-white">
                  New Chat
                </Text>
                <Text className="text-white/80 text-sm mt-0.5">
                  {filteredUsers.length} contacts available
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <SafeAreaView
        className="flex-1"
        edges={["right", "bottom", "left"]}
      >
        {/* Search Bar */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="px-4 pt-4 pb-2"
        >
          <View
            className={`flex-row items-center rounded-2xl px-4 h-12 ${
              applied === "dark" ? "bg-slate-800" : "bg-white"
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
              name="search"
              size={20}
              color={applied === "dark" ? "#64748b" : "#94a3b8"}
            />
            <TextInput
              className={`flex-1 text-base font-medium px-3 ${
                applied === "dark" ? "text-white" : "text-slate-800"
              }`}
              placeholder="Search contacts..."
              placeholderTextColor={applied === "dark" ? "#64748b" : "#94a3b8"}
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={applied === "dark" ? "#64748b" : "#94a3b8"}
                />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* New Contact Button */}
        <AnimatedTouchable
          entering={FadeInDown.delay(200).springify()}
          className="mx-4 my-2 rounded-2xl overflow-hidden"
          onPress={() => navigation.navigate("NewContactScreen")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#5CBFE3", "#F9AD6E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-row items-center px-5 py-4"
          >
            <View className="w-12 h-12 rounded-full bg-white/30 items-center justify-center mr-4">
              <Ionicons name="person-add" size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-bold text-lg">
                Add New Contact
              </Text>
              <Text className="text-white/80 text-sm">
                Invite friends to join Textie
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="white" />
          </LinearGradient>
        </AnimatedTouchable>

        {/* Contacts List */}
        <View className="flex-1 pt-2">
          {filteredUsers.length === 0 ? (
            <Animated.View
              entering={FadeInDown.delay(300).springify()}
              className="flex-1 justify-center items-center px-8"
            >
              <View
                className="w-24 h-24 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: "#5CBFE320" }}
              >
                <Ionicons
                  name={search ? "search-outline" : "people-outline"}
                  size={48}
                  color="#5CBFE3"
                />
              </View>
              <Text
                className={`text-xl font-bold mb-2 ${
                  applied === "dark" ? "text-white" : "text-slate-800"
                }`}
              >
                {search ? "No contacts found" : "No contacts yet"}
              </Text>
              <Text
                className={`text-center ${
                  applied === "dark" ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {search
                  ? "Try searching with a different name or number"
                  : "Add new contacts to start chatting"}
              </Text>
            </Animated.View>
          ) : (
            <>
              {/* Section Header */}
              <Animated.View
                entering={FadeInDown.delay(300).springify()}
                className="px-5 py-2"
              >
                <Text
                  className={`text-xs font-bold ${
                    applied === "dark" ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {search ? "SEARCH RESULTS" : "ALL CONTACTS"}
                </Text>
              </Animated.View>

              <FlatList
                data={filteredUsers}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}