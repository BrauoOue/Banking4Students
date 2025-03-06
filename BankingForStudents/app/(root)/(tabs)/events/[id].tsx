import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const events = [
    {
        id: "1",
        name: "Dinner Party",
        transactions: [
            { id: "1", sender: "Me", receiver: "Nikola J.", amount: 200, title: "Jabolko" },
            { id: "2", sender: "Gorazd F.", receiver: "Viktor K.", amount: 12, title: "Jabolko" },
            { id: "3", sender: "Viktor K.", receiver: "Me", amount: 45, title: "Jabolko" },
            { id: "4", sender: "Viktor K.", receiver: "Me", amount: 45, title: "Jabolko" },
            { id: "5", sender: "Viktor K.", receiver: "Me", amount: 45, title: "Jabolko" },
            { id: "7", sender: "Me", receiver: "Gorazd F.", amount: 20, title: "Jabolko" },
            { id: "6", sender: "Viktor K.", receiver: "Me", amount: 45, title: "Jabolko" }
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

const Event = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [isModalVisible, setModalVisible] = useState(false);
    const [newTransaction, setNewTransaction] = useState({ sender: "Me", receiver: "Nikola J.", amount: "", title: "" });
    const [stats, setStats] = useState({ owed: [], owing: [] });

    // Find the event
    const event = events.find((e) => e.id === id);

    useEffect(() => {
        if (event) {
            calculateStats();
        }
    }, [event]);

    const calculateStats = () => {
        const balances = {};
        event.transactions.forEach(transaction => {
            if (transaction.sender === "Me") {
                balances[transaction.receiver] = (balances[transaction.receiver] || 0) - transaction.amount;
            } else if (transaction.receiver === "Me") {
                balances[transaction.sender] = (balances[transaction.sender] || 0) + transaction.amount;
            }
        });

        const owed = [];
        const owing = [];
        for (const [person, amount] of Object.entries(balances)) {
            if (amount > 0) {
                owed.push({ person, amount });
            } else if (amount < 0) {
                owing.push({ person, amount: -amount });
            }
        }

        setStats({ owed, owing });
    };

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
        if (!newTransaction.amount || !newTransaction.title) return;
        event.transactions.push({
            id: (event.transactions.length + 1).toString(),
            sender: newTransaction.sender,
            receiver: newTransaction.receiver,
            amount: parseFloat(newTransaction.amount),
            title: newTransaction.title
        });
        setNewTransaction({ sender: "Me", receiver: "Nikola J.", amount: "", title: "" });
        calculateStats();
        toggleModal();
    };

    return (
        <View className="flex-1 bg-white px-4 pt-5">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold">{event.name}</Text>
                <TouchableOpacity onPress={toggleModal}>
                    <Text className="text-blue-500 text-lg">+ Add Transaction</Text>
                </TouchableOpacity>
            </View>

            {/* Transactions List */}
            <ScrollView className="mb-0 h-[20%]">
                {event.transactions.map((item) => (
                    <View key={item.id} className="bg-accent/40 p-4 mb-2 rounded-lg">
                        <Text className="text-base">
                            {item.sender} → {item.receiver}, for: {item.title} <Text className="font-bold">${item.amount}</Text>
                        </Text>
                    </View>
                ))}
            </ScrollView>

            {/* Stats Section */}
            <View className="flex-1">
                <Text className="text-lg font-bold mb-6">Summary</Text>
                <View className="flex-row justify-between">
                    <View className="bg-green-100 p-4 rounded-lg flex-1 mr-2">
                        <Text className="font-bold mb-2">Owed to you:</Text>
                        {stats.owing.map((item, index) => (
                            <Text key={index}>{item.person}: ${item.amount.toFixed(2)}</Text>
                        ))}
                    </View>
                    <View className="bg-red-100 p-4 rounded-lg flex-1 ml-2">
                        <Text className="font-bold mb-2">You owe:</Text>
                        {stats.owed.map((item, index) => (
                            <Text key={index}>{item.person}: ${item.amount.toFixed(2)}</Text>
                        ))}
                    </View>
                </View>
            </View>

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

                        {/* Title Input */}
                        <Text className="text-sm mb-1 mt-3">Title:</Text>
                        <TextInput
                            className="border border-gray-300 p-2 rounded"
                            placeholder="Enter title"
                            value={newTransaction.title}
                            onChangeText={(text) => setNewTransaction({ ...newTransaction, title: text })}
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
