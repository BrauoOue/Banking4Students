import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

// Mock event data
const events = [
    {
        id: "1",
        name: "Dinner Party",
        transactions: [
            { id: "1", sender: "Me", receiver: "Nikola J.", amount: 200 },
            { id: "2", sender: "Gorazd F.", receiver: "Viktor K.", amount: 12 },
            { id: "3", sender: "Viktor K.", receiver: "Me", amount: 45 }
        ]
    },
    {
        id: "2",
        name: "Weekend Trip",
        transactions: [
            { id: "4", sender: "John D.", receiver: "Sarah L.", amount: 80 },
            { id: "5", sender: "Me", receiver: "Gorazd F.", amount: 150 },
            { id: "6", sender: "Nikola J.", receiver: "Me", amount: 30 }
        ]
    }
];

const Event = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [isModalVisible, setModalVisible] = useState(false);
    const [newTransaction, setNewTransaction] = useState({ sender: "Me", receiver: "Nikola J.", amount: "" });

    // Find the event
    const event = events.find((e) => e.id === id);

    if (!event) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-lg font-bold">Event Not Found</Text>
            </View>
        );
    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleAddTransaction = () => {
        if (!newTransaction.amount) return;
        event.transactions.push({
            id: (event.transactions.length + 1).toString(),
            sender: newTransaction.sender,
            receiver: newTransaction.receiver,
            amount: parseFloat(newTransaction.amount)
        });
        setNewTransaction({ sender: "Me", receiver: "Nikola J.", amount: "" });
        toggleModal();
    };

    return (
        <View className="flex-1 bg-white px-4 pt-10">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold">{event.name}</Text>
                <TouchableOpacity onPress={toggleModal}>
                    <Text className="text-blue-500 text-lg">+ Add Transaction</Text>
                </TouchableOpacity>
            </View>

            {/* Transactions List */}
            {event.transactions.map((item) => (
                <View key={item.id} className="bg-gray-100 p-4 mb-2 rounded-lg">
                    <Text className="text-base">
                        {item.sender} → {item.receiver} <Text className="font-bold">${item.amount}</Text>
                    </Text>
                </View>
            ))}

            {/* Add Transaction Modal */}
            <Modal visible={isModalVisible} transparent animationType="slide">
                <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                    <View className="bg-white p-6 rounded-lg w-3/4">
                        <Text className="text-lg font-bold mb-4">Add Transaction</Text>

                        {/* Sender Picker */}
                        <Text className="text-sm mb-1">Sender:</Text>
                        <Picker
                            selectedValue={newTransaction.sender}
                            onValueChange={(value) => setNewTransaction({ ...newTransaction, sender: value })}
                        >
                            <Picker.Item label="Me" value="Me" />
                            <Picker.Item label="Nikola J." value="Nikola J." />
                            <Picker.Item label="Gorazd F." value="Gorazd F." />
                            <Picker.Item label="Viktor K." value="Viktor K." />
                        </Picker>

                        {/* Receiver Picker */}
                        <Text className="text-sm mb-1 mt-3">Receiver:</Text>
                        <Picker
                            selectedValue={newTransaction.receiver}
                            onValueChange={(value) => setNewTransaction({ ...newTransaction, receiver: value })}
                        >
                            <Picker.Item label="Me" value="Me" />
                            <Picker.Item label="Nikola J." value="Nikola J." />
                            <Picker.Item label="Gorazd F." value="Gorazd F." />
                            <Picker.Item label="Viktor K." value="Viktor K." />
                        </Picker>

                        {/* Amount Input */}
                        <Text className="text-sm mb-1 mt-3">Amount:</Text>
                        <TextInput
                            className="border border-gray-300 p-2 rounded"
                            placeholder="Enter amount"
                            keyboardType="numeric"
                            value={newTransaction.amount}
                            onChangeText={(text) => setNewTransaction({ ...newTransaction, amount: text })}
                        />

                        {/* Buttons */}
                        <View className="flex-row justify-between mt-4">
                            <TouchableOpacity onPress={toggleModal}>
                                <Text className="text-red-500">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleAddTransaction}>
                                <Text className="text-blue-500">Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Event;
