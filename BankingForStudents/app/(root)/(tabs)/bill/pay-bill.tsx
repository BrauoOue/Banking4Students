import React, {useState} from "react";
import {View, Text, TouchableOpacity, Image} from "react-native";
import icons from "@/constants/icons";
import {useRouter} from "expo-router";

const PayBill = () => {
    const router = useRouter();
    const [card, setCard] = useState({
        id: "1",
        bank: "VISA",
        number: "**** **** 1234 4567",
        balance: "€678.89",
        color: "bg-accent",
    });

    return (
        <View className="p-5 bg-white h-full items-center">
            {/* Title */}
            <Text className="text-2xl font-bold mb-4 border-b pb-2">Bill Splitting System</Text>

            {/* Card UI */}
            <View
                className={`w-64 h-40 p-5 rounded-lg ${card.color} m-2 shadow-lg`}
            >
                <Text className="text-white text-lg font-bold">{card.bank}</Text>
                <Text className="text-white text-sm mt-2">{card.number}</Text>
                <Text className="text-white text-2xl font-semibold mt-4">
                    {card.balance}
                </Text>
            </View>

            {/* Paying Message */}
            <View className="mt-6 items-center">
                <Text className="text-lg font-semibold">Paying...</Text>
                <Text className="text-gray-600 text-sm">Hold phone to card reader.</Text>
            </View>

            {/* Points Earned */}
            <View className="mt-6 flex-row items-center">
                <Text className="text-green-600 text-xl font-bold mr-1">+2</Text>
                <Image
                    source={icons.coins}
                    className="w-6 h-6"
                />
            </View>

            {/* Spend Points Button */}
            <TouchableOpacity className="mt-4 bg-blue-500 px-5 py-2 rounded-full" onPress={() => router.replace("/explore")}>
                <Text className="text-white text-lg font-bold">Spend your points</Text>
            </TouchableOpacity>
        </View>
    );
};

export default PayBill;
