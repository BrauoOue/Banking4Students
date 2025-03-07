import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {useGlobalContext} from "@/lib/global-provider";

const RequestMoney = () => {
    const {user, setUser, isLogged, ipAddress} = useGlobalContext();
    const [users, setUsers] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState("");
    const [amount, setAmount] = useState("");

    // Fetch users from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://${ipAddress}/api/main/user-list/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchData();
    }, [isLogged]);

    // Send Money Function
    const handleRequestMoney = async () => {
        if (!selectedEmail || !amount) {
            Alert.alert("Error", "Please select a user and enter an amount.");
            return;
        }

        const payload = {
            email: selectedEmail,
            amount,
        };

        try {
            const response = await fetch(`http://${ipAddress}/api/main/send-money/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Transaction failed.");
            }

            Alert.alert("Success", "Money sent successfully!");
            setAmount(""); // Reset amount field
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View className="p-4 bg-white h-full">
            <View className="flex-row items-center justify-center mb-4 mt-[20vh]">
                <Text className="text-xl font-bold ml-2 border-b pb-1">Request Money</Text>
            </View>

            {/* User Selection Picker */}
            <Text className="text-lg mb-2">Select a User</Text>
            <View className="border border-gray-300 rounded p-2 mb-4">
                <Picker
                    selectedValue={selectedEmail}
                    onValueChange={(itemValue) => setSelectedEmail(itemValue)}
                >
                    <Picker.Item label="Select User" value="" />
                    {users.filter((u) => u.email !== user?.email).map((u) => (
                        <Picker.Item
                            key={u.id}
                            label={`${u.name} (${u.email})`}
                            value={u.email}
                        />
                    ))}
                </Picker>
            </View>

            {/* Amount Input */}
            <Text className="text-lg mb-2">Enter Amount</Text>
            <TextInput
                className="border border-gray-300 rounded p-2 mb-4"
                keyboardType="numeric"
                placeholder="Enter amount"
                value={amount}
                onChangeText={setAmount}
            />

            {/* Send Money Button */}
            <TouchableOpacity
                onPress={handleRequestMoney}
                className="bg-blue-500 p-3 rounded"
            >
                <Text className="text-white text-center text-lg">Request Money</Text>
            </TouchableOpacity>
        </View>
    );
};

export default RequestMoney;
