import React, { useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useGlobalContext } from "@/lib/global-provider";
import icons from "@/constants/icons"; // Assuming coin icon is here

export default function Index() {
  const router = useRouter();
  const { isLogged } = useGlobalContext();

  useEffect(() => {
    if (!isLogged) {
      const timeout = setTimeout(() => {
        // router.replace("/sign-in"); // TODO uncomment this
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, []);

  const creditCards = [
    {
      id: "1",
      bank: "Visa",
      number: "**** 1234",
      balance: "$2,450.50",
      color: "bg-blue-500",
    },
    {
      id: "2",
      bank: "MasterCard",
      number: "**** 5678",
      balance: "$1,875.20",
      color: "bg-blue-700",
    },
    {
      id: "3",
      bank: "Amex",
      number: "**** 9876",
      balance: "$5,340.75",
      color: "bg-green-600",
    },
  ];

  const transactions = [
    {
      id: "1",
      title: "Spotify Subscription",
      amount: "-$9.99",
      date: "Feb 25",
      type: "debit",
    },
    {
      id: "2",
      title: "Freelance Payment",
      amount: "+$500.00",
      date: "Feb 22",
      type: "credit",
    },
    {
      id: "3",
      title: "Grocery Shopping",
      amount: "-$120.75",
      date: "Feb 20",
      type: "debit",
    },
  ];

  const requests = [
    {
      id: "1",
      from: "Nikola J.",
      amount: "-$9.99",
      date: "Feb 25",
      reason: "Restaurant Bill",
    },
    {
      id: "2",
      from: "Gorazd F.",
      amount: "-$2.99",
      date: "Feb 30",
      reason: "Srekja Bar",
    },
    {
      id: "3",
      from: "Andrea S.",
      amount: "-$11.11",
      date: "Jan 1",
      reason: "Public Room",
    },
  ];

  const partnership = {
    id: "1",
    title: "Let Spotify be your partner",
    amount: "100",
    desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  };

  return (
    <ScrollView className="flex-2 bg-white p-5">
      {/* Title */}
      <Text className="text-xl font-bold text-text mb-5">
        Your Credit/Virtual Cards
      </Text>

      {/* Credit Cards - Horizontally Scrollable */}
      <FlatList
        horizontal
        data={creditCards}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
        renderItem={({ item }) => (
          <View
            className={`w-64 h-40 p-5 rounded-lg ${item.color} m-2 shadow-lg`}
          >
            <Text className="text-white text-lg font-bold">{item.bank}</Text>
            <Text className="text-white text-sm mt-2">{item.number}</Text>
            <Text className="text-white text-2xl font-semibold mt-4">
              {item.balance}
            </Text>
          </View>
        )}
      />

      {/* Action Buttons */}
      <View className="flex-row justify-between my-5">
        {["Send", "Request", "My Uni", "Cash Stuffing"].map((action, index) => (
          <TouchableOpacity
            key={index}
            className="align-center justify-center bg-accent p-3 rounded-lg w-20 items-center shadow-md shadow-accent"
            onPress={() => {
              if (action === "My Uni") {
                router.replace("/my_uni");
              }
            }}
          >
            <Text className="text-white text-sm font-semibold text-center">
              {action}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transaction History */}
      <Text className="text-lg font-bold text-text mt-4">
        Recent Transactions
      </Text>
      <View className="p-3 rounded-lg">
        {transactions.map((transaction) => (
          <View
            key={transaction.id}
            className="flex-row justify-between border-b border-gray-300 py-3"
          >
            <View>
              <Text className="text-gray-900 font-semibold">
                {transaction.title}
              </Text>
              <Text className="text-gray-500 text-xs">{transaction.date}</Text>
            </View>
            <Text
              className={`font-semibold ${
                transaction.type === "credit"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {transaction.amount}
            </Text>
          </View>
        ))}
      </View>

      {/* Requests */}
      <Text className="text-lg font-bold text-text mt-4">Requests</Text>
      <FlatList
        horizontal
        data={requests}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
        renderItem={({ item }) => (
          <View className="w-40 h-28 bg-gray-100 p-3 m-2 rounded-lg shadow-md">
            <Text className="text-lg font-bold text-gray-900">{item.from}</Text>
            <Text className="text-sm text-gray-600">{item.reason}</Text>
            <Text className="text-red-500 font-bold mt-2">{item.amount}</Text>
            <View className="flex-row justify-between mt-2">
              <TouchableOpacity className="bg-green-500 px-3 py-1 rounded-md">
                <Image
                  source={icons.accept}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                {/*<Text className="text-white font-bold">Accept</Text>*/}
              </TouchableOpacity>
              <TouchableOpacity className="bg-red-500 px-3 py-1 rounded-md">
                <Image
                  source={icons.deny}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                {/*<Text className="text-white font-bold">Deny</Text>*/}
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Partnerships */}
      <Text className="text-lg font-bold text-text my-4">Partnerships</Text>
      <View className="bg-accent p-4 rounded-lg shadow-lg shadow-accent">
        <Text className="text-lg font-bold text-white">
          {partnership.title}
        </Text>
        <Text className="text-white text-sm mt-1">{partnership.desc}</Text>
        <View className="flex-row items-center mt-2">
          <Image
            source={icons.coins}
            className="w-5 h-5"
            resizeMode="contain"
          />
          <Text className="text-lg font-bold text-yellow-500 ml-2">
            {partnership.amount} Points
          </Text>
        </View>
      </View>
      <TouchableOpacity
        className="bg-primary p-3 mt-3 mb-[15vh] rounded-lg items-center shadow-md"
        onPress={() => router.push("/explore")}
      >
        <Text className="text-white text-sm font-semibold">Check out more</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
