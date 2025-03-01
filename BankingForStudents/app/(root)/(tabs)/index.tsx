import React, {useEffect} from "react";
import {Text, View, FlatList, ScrollView, TouchableOpacity} from "react-native";
import {useRouter} from "expo-router";
import {useGlobalContext} from "@/lib/global-provider";

export default function Index() {
    const router = useRouter();
    const {isLogged} = useGlobalContext();

    useEffect(() => {
        if (!isLogged) {
            const timeout = setTimeout(() => {
                router.replace("/sign-in");
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, []);

    // Sample credit cards data
    const creditCards = [
        {id: "1", bank: "Visa", number: "**** 1234", balance: "$2,450.50", color: "bg-blue-500"},
        {id: "2", bank: "MasterCard", number: "**** 5678", balance: "$1,875.20", color: "bg-green-500"},
        {id: "3", bank: "Amex", number: "**** 9876", balance: "$5,340.75", color: "bg-purple-500"},
    ];

    // Sample transaction history
    const transactions = [
        {id: "1", title: "Spotify Subscription", amount: "-$9.99", date: "Feb 25", type: "debit"},
        {id: "2", title: "Freelance Payment", amount: "+$500.00", date: "Feb 22", type: "credit"},
        {id: "3", title: "Grocery Shopping", amount: "-$120.75", date: "Feb 20", type: "debit"},
        {id: "4", title: "Grocery Shopping", amount: "+$120.75", date: "Feb 20", type: "debit"},
        {id: "5", title: "Grocery Shopping", amount: "-$20.75", date: "Feb 21", type: "debit"},
        {id: "6", title: "Grocery Shopping", amount: "+$320.75", date: "Feb 20", type: "debit"},
    ];

    return (
        <View className="flex-1 bg-white p-5">
            {/* Title */}
            <Text className="text-xl font-bold text-gray-900 mb-5">Welcome to Banking4Students</Text>

            {/* Credit Cards - Horizontally Scrollable */}
            <FlatList
                horizontal
                data={creditCards}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 10}}
                renderItem={({item}) => (
                    <View className={`w-64 h-40 p-5 rounded-lg ${item.color} m-2 shadow-lg`}>
                        <Text className="text-white text-lg font-bold">{item.bank}</Text>
                        <Text className="text-white text-sm mt-2">{item.number}</Text>
                        <Text className="text-white text-2xl font-semibold mt-4">{item.balance}</Text>
                    </View>
                )}
            />

            {/* Action Buttons */}
            <View className="flex-row justify-between my-5">
                {["Requests", "Pay Bills", "Add Card", "More"].map((action, index) => (
                    <TouchableOpacity key={index}
                                      className="bg-primary p-3 rounded-lg w-20 items-center shadow-md shadow-accent">
                        <Text className="text-gray-700 text-xs font-semibold">{action}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Transaction History */}
            <Text className="text-lg font-bold text-gray-900 my-4">Recent Transactions</Text>
            <ScrollView className="bg-gray-100 p-3 rounded-lg">
                {transactions.map((transaction) => (
                    <View key={transaction.id} className="flex-row justify-between border-b border-gray-300 py-3">
                        <View>
                            <Text className="text-gray-900 font-semibold">{transaction.title}</Text>
                            <Text className="text-gray-500 text-xs">{transaction.date}</Text>
                        </View>
                        <Text
                            className={`font-semibold ${transaction.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                            {transaction.amount}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
