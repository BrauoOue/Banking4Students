import React, {useEffect, useState} from "react";
import {View, Text, TextInput, TouchableOpacity, Alert} from "react-native";
import {Picker} from "@react-native-picker/picker";
import {useGlobalContext} from "@/lib/global-provider";

const Transaction = () => {
    const {user, isLogged, ipAddress} = useGlobalContext();
    const [users, setUsers] = useState([]);
    const [creditCard, setCreditCard] = useState({});
    const [otherCreditCard, setOtherCreditCard] = useState([]);
    const [toTransactionNumber, setToTransactionNumber] = useState("");
    const [amount, setAmount] = useState("");

    // Fetch users when logged in
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

        if (isLogged) {
            fetchData();
        }
    }, [user, isLogged]);

    // fetchin credit card
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://${ipAddress}/api/main/transaction-accounts/${user?.id}/`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                setCreditCard(data[0]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (isLogged) {
            fetchData();
        }
    }, [user, isLogged]);

    // fetchin other credit cards
    useEffect(() => {
        const fetchData = async (u) => {
            try {
                const response = await fetch(
                    `http://${ipAddress}/api/main/transaction-accounts/${u?.id}/`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                setOtherCreditCard([...otherCreditCard, data[0]]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (isLogged) {
            users.filter((u) => u.email !== user?.email).forEach((u) => {
                console.log(u)
                fetchData(u)
            })
        }
    }, [users]);

    // Handle transaction submission
    const handleTransaction = async () => {
        if (!toTransactionNumber || !amount) {
            Alert.alert("Error", "Please select a recipient and enter an amount.");
            return;
        }

        const payload = {
            from_transaction_number: creditCard.number,
            to_transaction_number: toTransactionNumber,
            amount: parseFloat(amount),
        };

        try {
            const response = await fetch(`http://${ipAddress}/api/main/transaction/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Transaction failed.");
            }

            Alert.alert("Success", "Transaction completed successfully!");
            setAmount(""); // Reset amount field
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View className="p-4 bg-white h-full">
            <Text className="text-2xl font-bold mb-4">Make a Transaction</Text>

            {/* From Transaction Number */}
            <Text className="text-lg mb-2">From Transaction Number</Text>
            <TextInput
                className="border border-gray-300 rounded p-2 mb-4 bg-gray-200"
                value={creditCard.number || ""}
                editable={false} // Disable editing for sender's transaction number
            />

            {/* To Transaction Number Picker */}
            <Text className="text-lg mb-2">To Transaction Number</Text>
            <View className="border border-gray-300 rounded p-2 mb-4">
                <Picker
                    selectedValue={toTransactionNumber}
                    onValueChange={(itemValue) => setToTransactionNumber(itemValue)}
                >
                    <Picker.Item label="Select Recipient" value=""/>
                    {otherCreditCard
                        .filter((u) => u.number !== creditCard.number) // Exclude sender
                        .map((u) => (
                            <Picker.Item
                                key={u.id}
                                label={`${u.bank_name} (${u.number})`}
                                value={u.number}
                            />
                        ))}
                </Picker>
            </View>

            {/* Amount Input */}
            <Text className="text-lg mb-2">Amount</Text>
            <TextInput
                className="border border-gray-300 rounded p-2 mb-4"
                keyboardType="numeric"
                placeholder="Enter amount"
                value={amount}
                onChangeText={setAmount}
            />

            {/* Send Transaction Button */}
            <TouchableOpacity
                onPress={handleTransaction}
                className="bg-blue-500 p-3 rounded"
            >
                <Text className="text-white text-center text-lg">Make a Transaction</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Transaction;
