import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";

const BillSplitting = () => {
    const [method, setMethod] = useState("By items"); // Can be "Evenly" or "By items"
    const [billName, setBillName] = useState("Receipt");

    // Sample participants
    const participants = [
        { id: "1", name: "NJ", color: "bg-red-400" },
        { id: "2", name: "VK", color: "bg-green-400" },
        { id: "3", name: "AS", color: "bg-yellow-400" }
    ];

    const [selectedParticipants, setSelectedParticipants] = useState(["1", "2", "3"]);

    const toggleParticipant = (id: string) => {
        setSelectedParticipants((prev) =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    // Sample bill items
    const billItems = [
        { name: "Oysters Dozen", price: 2.61 },
        { name: "Clam Chowder", price: 5.50 },
        { name: "Grilled Lobster", price: 12.49 },
        { name: "Crab Cakes", price: 8.75, quantity: 2 },
        { name: "Fish Tacos", price: 6.25, quantity: 3 },
        { name: "Shrimp Scampi", price: 11.50 },
        { name: "Fried Calamari", price: 20.00 },
        { name: "Salmon Fillet", price: 13.45, quantity: 2 },
        { name: "Clam Bake", price: 15.49 },
        { name: "Steamed Mussels", price: 7.25 }
    ];

    // Calculate total
    const subtotal = billItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const perPerson = subtotal / selectedParticipants.length;

    return (
        <View className="flex-1 bg-white p-4">
            {/* Header */}
            <Text className="text-xl font-bold">🔵 Bill Splitting System</Text>

            {/* Bill & Method Selection */}
            <Text className="mt-4">Bill:</Text>
            <TextInput className="border p-2 rounded mb-2" value={billName} onChangeText={setBillName} />

            <Text>Method:</Text>
            <TextInput className="border p-2 rounded mb-4" value={method} onChangeText={setMethod} />

            {/* Participants */}
            <View className="flex-row space-x-2 mb-4">
                {participants.map((p) => (
                    <TouchableOpacity key={p.id} onPress={() => toggleParticipant(p.id)}>
                        <View className={`p-3 rounded-full ${p.color} ${selectedParticipants.includes(p.id) ? "opacity-100" : "opacity-50"}`}>
                            <Text className="text-white font-bold">{p.name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Bill Items */}
            <ScrollView className="mb-4">
                {billItems.map((item, index) => (
                    <View key={index} className="flex-row justify-between border-b p-2">
                        <Text>{item.quantity ? `${item.quantity}x ` : ""}{item.name}</Text>
                        <Text>€{(item.price * (item.quantity || 1)).toFixed(2)}</Text>
                    </View>
                ))}
            </ScrollView>

            {/* Summary */}
            <Text className="text-lg font-bold">Subtotal: €{subtotal.toFixed(2)}</Text>
            <Text className="text-lg font-bold">Your Part: €{perPerson.toFixed(2)}</Text>

            {/* Pay Bill Button */}
            <TouchableOpacity className="bg-blue-500 p-3 rounded mt-4">
                <Text className="text-white text-center font-bold">Pay Bill</Text>
            </TouchableOpacity>
        </View>
    );
};

export default BillSplitting;
