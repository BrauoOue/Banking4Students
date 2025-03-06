import React, {useEffect, useState} from "react";
import {
    Text,
    View,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Image, Modal,
    TextInput,
    Button,
} from "react-native";
import {useRouter} from "expo-router";
import {useGlobalContext} from "@/lib/global-provider";
import icons from "@/constants/icons";
import {Ionicons} from "@expo/vector-icons";

export default function Index() {
    const router = useRouter();
    const {user, setUser, isLogged} = useGlobalContext();
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [limit, setLimit] = useState("1000");
    const [userModalVisible, setUserModalVisible] = useState(false);
    const [creditCards, setCreditCards] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [users, setUsers] = useState([]);

    // fetchin users
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/main/user-list/`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (isLogged) {
            fetchData();
        }
    }, [isLogged]);

    // fetchin credit cards
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/main/transaction-accounts/${user?.id}/`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                setCreditCards(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (isLogged) {
            fetchData();
        }
    }, [user, isLogged]);

    // fetchin transactions
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/main/transactions/${user?.email}/`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (isLogged) {
            fetchData();
        }
    }, [user, isLogged]);

    const toggleUserSelection = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }

    };

    const handleCreateCard = () => {
        const newCard = {
            name,
            usersIds: selectedUsers,
            limit: parseInt(limit)
        };
        // todo remove this mock
        const mockCard = {
            id: "10",
            bank: name,
            number: "- Nikola J.\n- Viktor K.",
            balance: "$" + limit,
        };
        setCreditCards((prevCreditCards) => [
            ...prevCreditCards,
            mockCard,
        ])
        console.log("Created Virtual Card:", newCard);
        setModalVisible(false);

    };

    useEffect(() => {
        if (!isLogged) {
            const timeout = setTimeout(() => {
                // router.replace("/sign-in"); // TODO uncomment this
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, []);

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

    function transformDate(date: string) {
        return date.split("T")[0]
    }

    return (
        <ScrollView className="flex-2 bg-white p-5">
            {/* Title */}
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold">Your Credit / Virtual Cards</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Ionicons name="add-circle-outline" size={28} color="black"/>
                </TouchableOpacity>
            </View>

            {/* Credit Cards - Horizontally Scrollable */}
            <FlatList
                horizontal
                data={creditCards}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 10}}
                renderItem={({item}) => (
                    <View
                        className={`w-64 h-40 p-5 rounded-lg bg-accent m-2 shadow-lg`}
                    >
                        <Text className="text-white text-lg font-bold">{item.bank}</Text>
                        <Text className="text-white text-sm mt-2">{item.number}</Text>
                        <Text className="text-white text-2xl font-semibold mt-4">
                            {"$" + item.balance}
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
                            if (action == "Send") {
                                router.replace("/send")
                            }
                            if (action == "Request") {
                                router.replace("/request")
                            }
                            if (action == "Cash Stuffing") {
                                router.replace("/cashstuffing")
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
                                {transaction.category}
                            </Text>
                            <Text className="text-gray-500 text-xs">{transformDate(transaction.date)}</Text>
                        </View>
                        <Text
                            className={`font-semibold ${
                                transaction.type === "f"
                                    ? "text-green-600"
                                    : "text-red-500"
                            }`}
                        >
                            {"$" + transaction.amount}
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
                contentContainerStyle={{paddingBottom: 10}}
                renderItem={({item}) => (
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


            {/* Modal for creating virtual card */}
            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white p-5 rounded-lg w-4/5">
                        <Text className="text-lg font-bold mb-3">Create Virtual Card</Text>

                        {/* Name Input */}
                        <Text className="mb-1">Card Name</Text>
                        <TextInput
                            className="border border-gray-300 p-2 rounded mb-3"
                            value={name}
                            onChangeText={setName}
                        />

                        {/* Users Multi-Select Button */}
                        <Text className="mb-1">Select Users</Text>
                        <TouchableOpacity
                            className="border border-gray-300 p-2 rounded mb-3"
                            onPress={() => setUserModalVisible(true)}
                        >
                            <Text>{selectedUsers.length > 0 ? `${selectedUsers.length} users selected` : "Select Users"}</Text>
                        </TouchableOpacity>

                        {/* Display Selected Users */}
                        {selectedUsers.length > 0 && (
                            <View className="flex-row flex-wrap mt-2">
                                {selectedUsers.map((userId) => {
                                    const user = users.find((u) => u.id === userId);
                                    return (
                                        <View key={userId} className="bg-gray-200 p-2 rounded-lg m-1">
                                            <Text>{user?.name}</Text>
                                        </View>
                                    );
                                })}
                            </View>
                        )}

                        {/* Limit Input */}
                        <Text className="mb-1 mt-3">Set Limit</Text>
                        <TextInput
                            className="border border-gray-300 p-2 rounded mb-3"
                            keyboardType="numeric"
                            value={limit}
                            onChangeText={setLimit}
                        />

                        {/* Buttons */}
                        <View className="flex-row justify-between mt-3">
                            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red"/>
                            <Button title="Create" onPress={handleCreateCard} color="green"/>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal for selecting multiple users */}
            <Modal animationType="slide" transparent={true} visible={userModalVisible}>
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white p-5 rounded-lg w-4/5">
                        <Text className="text-lg font-bold mb-3">Select Users</Text>
                        <FlatList
                            data={users}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    className="flex-row items-center justify-between p-2 border-b border-gray-300"
                                    onPress={() => toggleUserSelection(item.id)}
                                >
                                    <Text>{item.name}</Text>
                                    {selectedUsers.includes(item.id) && (
                                        <Ionicons name="checkmark-circle" size={20} color="green"/>
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                        <Button title="Done" onPress={() => setUserModalVisible(false)}/>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}
