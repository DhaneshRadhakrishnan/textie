import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useChatList } from "../socket/UseChatList";
import { formatChatTime } from "../util/DateFormatter";
import { Chat } from "../socket/chat";
import { AuthContext } from "../components/AuthProvider";

import Animated, { FadeIn, FadeInRight } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

type HomeScreenProps = NativeStackNavigationProp<RootStack, "HomeScreen">;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProps>();
  const [search, setSearch] = useState("");
  const chatList = useChatList();
  const [isModalVisible, setModalVisible] = useState(false);
  const auth = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <LinearGradient
          colors={["#5CBFE3", "#7EC8E8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingTop: Platform.OS === "ios" ? 50 : 40,
            paddingBottom: 16,
          }}
        >
          <View className="flex-row items-center justify-between px-5">
            <View className="flex-1">
              <Text className="font-bold text-3xl text-white">Textie</Text>
              <Text className="text-white/80 text-sm mt-0.5">
                {chatList.length} conversations
              </Text>
            </View>
            <View className="flex-row space-x-4 items-center">
              <TouchableOpacity className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                <Ionicons name="camera-outline" size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
              >
                <Ionicons name="ellipsis-vertical" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Modern Modal */}
          <Modal
            animationType="fade"
            visible={isModalVisible}
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <Pressable
              className="flex-1 bg-black/50"
              onPress={() => setModalVisible(false)}
            >
              <View className="flex-1 justify-start items-end p-5 pt-24">
                <Pressable
                  onPress={(e) => e.stopPropagation()}
                  className="bg-white rounded-3xl overflow-hidden"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                    elevation: 10,
                  }}
                >
                  <View className="w-60">
                    <TouchableOpacity
                      className="flex-row items-center px-5 py-4 border-b border-gray-100"
                      onPress={() => {
                        navigation.navigate("SettingScreen");
                        setModalVisible(false);
                      }}
                    >
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: "#5CBFE320" }}
                      >
                        <Ionicons name="settings-outline" size={20} color="#5CBFE3" />
                      </View>
                      <Text className="font-semibold text-base text-slate-800">
                        Settings
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="flex-row items-center px-5 py-4 border-b border-gray-100"
                      onPress={() => {
                        navigation.navigate("ProfileScreen");
                        setModalVisible(false);
                      }}
                    >
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: "#F9AD6E20" }}
                      >
                        <Ionicons name="person-outline" size={20} color="#F9AD6E" />
                      </View>
                      <Text className="font-semibold text-base text-slate-800">
                        My Profile
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="flex-row items-center px-5 py-4"
                      onPress={() => {
                        if (auth) auth.signOut();
                      }}
                    >
                      <View className="w-10 h-10 rounded-full items-center justify-center mr-3 bg-red-50">
                        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                      </View>
                      <Text className="font-semibold text-base text-red-500">
                        Log Out
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Pressable>
              </View>
            </Pressable>
          </Modal>
        </LinearGradient>
      ),
    });
  }, [navigation, isModalVisible, chatList.length]);

  const filteredChats = [...chatList]
    .filter((chat) => {
      return (
        chat.friendName.toLowerCase().includes(search.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort(
      (a, b) =>
        new Date(b.lastTimeStamp).getTime() -
        new Date(a.lastTimeStamp).getTime()
    );

  const renderItem = ({ item, index }: { item: Chat; index: number }) => (
    <AnimatedTouchable
      entering={FadeInRight.delay(index * 50).springify()}
      className="flex-row items-center py-3 px-4 bg-white mx-3 my-1 rounded-2xl"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
      onPress={() => {
        navigation.navigate("SingleChatScreen", {
          chatId: item.friendId,
          friendName: item.friendName,
          lastSeenTime: formatChatTime(item.lastTimeStamp),
          profileImage: item.profileImage
            ? item.profileImage
            : `https://ui-avatars.com/api/?name=${item.friendName.replace(
              " ",
              "+"
            )}&background=random`,
        });
      }}
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
                  : `https://ui-avatars.com/api/?name=${item.friendName.replace(
                    " ",
                    "+"
                  )}&background=random`,
              }}
              className="h-14 w-14 rounded-full"
            />
          </View>
        </LinearGradient>
        {/* Online Indicator (optional) */}
        <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
      </View>

      {/* Chat Info */}
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text
            className="font-bold text-lg text-slate-800 flex-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.friendName}
          </Text>
          <Text className="font-medium text-xs text-slate-400 ml-2">
            {formatChatTime(item.lastTimeStamp)}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text
            className="text-slate-500 flex-1 text-sm"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <LinearGradient
              colors={["#5CBFE3", "#F9AD6E"]}
              style={{
                borderRadius: 9999, // rounded-full
                paddingHorizontal: 8, // px-2 (Tailwind px-2 ≈ 8px)
                paddingVertical: 4,   // py-1 (Tailwind py-1 ≈ 4px)
                marginLeft: 8,        // ml-2 (≈ 8px)
                minWidth: 24,
                alignItems: "center",
                justifyContent: "center", // usually needed to center children
              }}
            >
              <Text className="text-white text-xs font-bold">
                {item.unreadCount > 99 ? "99+" : item.unreadCount}
              </Text>
            </LinearGradient>
          )}
        </View>
      </View>
    </AnimatedTouchable>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#5CBFE3" />
      <SafeAreaView
        className="flex-1"
        edges={["right", "bottom", "left"]}
      >
        {/* Search Bar */}
        <View className="px-4 pt-4 pb-2">
          <View
            className="flex-row items-center bg-white rounded-2xl px-4 h-12"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Ionicons name="search" size={20} color="#94a3b8" />
            <TextInput
              className="flex-1 text-base font-medium ps-3"
              placeholder="Search conversations..."
              placeholderTextColor="#94a3b8"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={20} color="#94a3b8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Chat List */}
        <View className="flex-1">
          {filteredChats.length === 0 ? (
            <View className="flex-1 justify-center items-center px-8">
              <View
                className="w-24 h-24 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: "#5CBFE320" }}
              >
                <Ionicons name="chatbubbles-outline" size={48} color="#5CBFE3" />
              </View>
              <Text className="text-xl font-bold text-slate-700 mb-2">
                No conversations yet
              </Text>
              <Text className="text-center text-slate-500">
                Start a new chat by tapping the button below
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredChats}
              renderItem={renderItem}
              keyExtractor={(item) => item.friendId.toString()} //it return number, you changed into string
              contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Floating Action Button */}
        <TouchableOpacity
          className="absolute bottom-20 right-6 w-16 h-16 rounded-full shadow-xl items-center justify-center"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
          onPress={() => navigation.navigate("NewChatScreen")}
        >
          <LinearGradient
            className="w-full h-full rounded-full items-center justify-center"

            colors={['#5CBFE3', '#F9AD6E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: 15,
              borderRadius: 30,
              alignItems: 'center',
            }}

          >
            <Ionicons name="add" size={32} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}