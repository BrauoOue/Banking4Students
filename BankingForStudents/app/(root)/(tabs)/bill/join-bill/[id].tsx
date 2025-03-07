import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, FlatList, Image, ScrollView} from "react-native";
import {Picker} from "@react-native-picker/picker";
import icons from "@/constants/icons";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useGlobalContext} from "@/lib/global-provider";

const colors = ["bg-red-400", "bg-accent", "bg-green-400", "bg-yellow-400", "bg-orange-400"];

const billDropdown = ["Receipt", "Online"];
const methodDropdown = ["By items", "Divide bill equally"];

const participants = [
    {id: "0", name: "Me", color: colors[0]},
    {id: "1", name: "VK", color: colors[1]},
];

// const billItems = [
//     {itemName: "Oysters Dozen", amount: 1, price: 2.61},
//     {itemName: "Clam Chowder", amount: 1, price: 5.50},
//     {itemName: "Grilled Lobster", amount: 1, price: 12.49},
//     {itemName: "Crab Cakes", amount: 2, price: 8.75},
//     {itemName: "Fish Tacos", amount: 3, price: 6.25},
//     {itemName: "Shrimp Scampi", amount: 1, price: 11.50},
//     {itemName: "Fried Calamari", amount: 1, price: 20.00},
//     {itemName: "Salmon Fillet", amount: 2, price: 13.45},
//     {itemName: "Clam Bake", amount: 1, price: 15.49},
//     {itemName: "Steamed Mussels", amount: 1, price: 7.25}
// ];

const BillSplitting = () => {
        const {id} = useLocalSearchParams();
        const [cards, setCards] = useState([
            {
                "id": 3,
                "number": "20000000000001",
                "balance": "5510.00",
                "bank": 2,
                "bank_name": "NLB",
                "trans_owner": 3
            }
        ]);
        const {itemcinja, setItemcinja, ipAddress, user} = useGlobalContext();

        // useEffect(() => {
        //     // Fetch data from the API
        //     const fetchData = async () => {
        //         try {
        //             const response = await fetch(
        //                 `http://${ipAddress}/api/main/transaction-accounts/${user?.id}/`
        //             );
        //
        //             if (!response.ok) {
        //                 throw new Error("Failed to fetch data");
        //             }
        //
        //             const data = await response.json(); // Parse the response as JSON
        //             setCards(data); // Update the state with the fetched data
        //             console.log("Card", cards)
        //         } catch (error) {
        //             console.error("Error fetching data:", error);
        //             // Handle errors (e.g., show a message to the user)
        //         }
        //     };

        // fetchData(); // Call the fetch function
        // }, [user, id]);

        useEffect(() => {
                const fetchData = async () => {
                    try {
                        const datice = {
                            transaction_acc_number: cards[0].number,
                        };

                        const response = await fetch(`http://${ipAddress}/api/owents/join-party/${id}`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(datice),
                        });

                        if (!response.ok) {
                            throw new Error("Failed to fetch data");
                        }

                        const data = await response.json();
                        setItemcinja(data.receipt);
                        console.log(itemcinja)
                        console.log("HEREEEEE: ",itemcinja.items)
                    } catch
                        (error) {
                        console.error("Error fetching data:", error);
                    }
                };

                fetchData();
            }, [id]
        )
        ;

        const router = useRouter()
        const [billType, setBillType] = useState(billDropdown[0]);
        const [method, setMethod] = useState(methodDropdown[0]);
        const [selectedItems, setSelectedItems] = useState([]);

        const toggleItemSelection = (itemName) => {
            setSelectedItems((prev) =>
                prev.includes(itemName)
                    ? prev.filter((item) => item !== itemName)
                    : [...prev, itemName]
            );
        };

        const totalAmount = itemcinja.items.reduce((sum, item) => sum + item.amount * item.price, 0).toFixed(2);
        const myPart = (method === "By items"
                ? itemcinja.items.filter((item) => selectedItems.includes(item.itemName)).reduce((sum, item) => sum + item.amount * item.price, 0)
                : totalAmount / participants.length
        ).toFixed(2);

        const acceptPayment = async () => {
            const data = {
                party_id: id, // Party ID from the URL params
                student_id: user?.id, // User ID from global context
                amount: myPart, // Amount to pay, calculated from selected items or split
            };

            try {
                const response = await fetch(`http://${ipAddress}/api/owents/ap/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    throw new Error("Payment acceptance failed");
                }

                const result = await response.json();
                console.log("Payment accepted:", result);
                // Redirect to a success page or show a success message
                router.replace("/");
            } catch (error) {
                console.error("Error accepting payment:", error);
                // Handle error, show a message to the user if necessary
            }
        };

        return (
            <ScrollView className="p-4 bg-white">
                {/* Title */}
                <View className="flex-row items-center justify-center mb-4">
                    <View className={`w-6 h-6 rounded-full border border-black ${participants[0].color}`}/>
                    <Text className="text-xl font-bold ml-2 border-b pb-1">Bill Splitting System</Text>
                </View>

                {/* Dropdowns */}
                <Text className="text-bold pl-2 text-text text-md">Type of Bill:</Text>
                <Picker selectedValue={billType} onValueChange={(value) => setBillType(value)}>
                    {billDropdown.map((item, index) => (
                        <Picker.Item key={index} label={item} value={item}/>
                    ))}
                </Picker>

                <Text className="text-bold pl-2 text-text text-md">Paying Method:</Text>
                <Picker selectedValue={method} onValueChange={(value) => setMethod(value)}>
                    {methodDropdown.map((item, index) => (
                        <Picker.Item key={index} label={item} value={item}/>
                    ))}
                </Picker>

                {/* Participants */}
                <View className="flex-row justify-around my-4">
                    {participants.slice(1).map((p) => (
                        <View key={p.id} className="items-center">
                            <View className="flex-row items-center">
                                <View
                                    className={`w-10 h-10 rounded-full border border-black ${p.color} flex justify-center items-center`}>
                                    <Text className="text-text font-bold">{p.name}</Text>
                                </View>
                                <Image source={icons.accept} className="w-6 h-6 ml-2" resizeMode="contain"/>
                            </View>
                            <TouchableOpacity
                                className="mt-1 align-center justify-center bg-accent p-1 rounded-lg w-20 items-center shadow-md shadow-accent">
                                <Text className="text-white text-sm font-semibold text-center">
                                    Pay for
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Bill Items */}
                {method === "By items" && (
                    <FlatList
                        data={itemcinja.items}
                        keyExtractor={(item) => item.itemName}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                onPress={() => toggleItemSelection(item.itemName)}
                                className={`flex-row justify-between p-2 border-b ${selectedItems.includes(item.itemName) ? colors[0] : ""}`}
                            >
                                <Text>{item.amount} {item.itemName}</Text>
                                <Text>{(item.amount * item.price).toFixed(2)}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}

                {/* Total and My Part */}
                <View className="mt-1 p-2">
                    <Text className="text-lg font-bold">Subtotal: €{totalAmount}</Text>
                    <Text className="text-lg font-bold">Your Part: €{myPart}</Text>
                </View>

                {/* Pay Bill Button */}
                <TouchableOpacity
                    onPress={acceptPayment}
                    className="bg-primary p-4 rounded-full mt-4 mb-[13vh]"
                >
                    <Text className="text-white text-center">Accept Payment</Text>
                </TouchableOpacity>


            </ScrollView>
        );
    }
;

export default BillSplitting;
