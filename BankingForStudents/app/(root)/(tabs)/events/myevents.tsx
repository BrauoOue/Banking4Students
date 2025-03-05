import React from "react";
import { Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Mock events JSON
const events = [
    {
        id: "1",
        name: "Dinner Party",
        transactions: [
            { id: "1", sender: "Me", receiver: "Nikola J.", amount: 200, title: "Jabolko" },
            { id: "2", sender: "Gorazd F.", receiver: "Viktor K.", amount: 12, title: "Jabolko" },
            { id: "3", sender: "Viktor K.", receiver: "Me", amount: 45, title: "Jabolko" }
        ]
    },
    {
        id: "2",
        name: "Weekend Trip",
        transactions: [
            { id: "4", sender: "John D.", receiver: "Sarah L.", amount: 80, title: "Jabolko" },
            { id: "5", sender: "Me", receiver: "Gorazd F.", amount: 150, title: "Jabolko" },
            { id: "6", sender: "Nikola J.", receiver: "Me", amount: 30, title: "Jabolko" }
        ]
    }
];

const Events = () => {
    const router = useRouter();

    return (
        <View className="flex-1 bg-white px-4 pt-10">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold">Events</Text>
                <TouchableOpacity onPress={() => router.push("/events/new")}>
                    <Ionicons name="add-circle-outline" size={28} color="black" />
                </TouchableOpacity>
            </View>

            {/* Event Cards */}
            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className="bg-gray-100 rounded-lg p-4 mb-4"
                        style={{ height: "40vh" }} // 40% height for each event card
                        onPress={() => router.push(`/events/${item.id}`)}
                    >
                        <Text className="text-lg font-bold mb-2">{item.name}</Text>
                        {item.transactions.map((transaction) => (
                            <Text key={transaction.id} className="text-base">
                                {transaction.sender} → {transaction.receiver}<Text className="font-bold">${transaction.amount}</Text>
                            </Text>
                        ))}
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default Events;
