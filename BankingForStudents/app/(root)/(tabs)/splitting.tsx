import React, {useState, useEffect} from "react";
import {Modal, View, Text, TouchableOpacity} from "react-native";
import {useRouter} from "expo-router";
import {Picker} from "@react-native-picker/picker";
import {useGlobalContext} from "@/lib/global-provider";

const Splitting = () => {
    const {user, ipAddress, setQrCode} = useGlobalContext();
    const [modalVisible, setModalVisible] = useState(false); // Track modal visibility
    const [selectedCard, setSelectedCard] = useState(null); // Track selected card
    const [modalType, setModalType] = useState("");
    const router = useRouter();
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

    useEffect(() => {
        // Fetch data from the API
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://${ipAddress}/api/main/transaction-accounts/${user?.id}/`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json(); // Parse the response as JSON
                setCards(data); // Update the state with the fetched data
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle errors (e.g., show a message to the user)
            }
        };

        fetchData(); // Call the fetch function
    }, [user]);

    const creditCards = [
        {id: "1", bank: "Visa"},
        {id: "2", bank: "MasterCard"},
        {id: "3", bank: "Amex"},
    ];

    const CreateBill = () => {
        setModalType("create"); // Set modal type to "create" when Create Bill is clicked
        setModalVisible(true); // Show modal
    };

    const JoinBill = () => {
        setModalType("join"); // Set modal type to "join" when Join Bill is clicked
        setModalVisible(true); // Show modal
    };

    const MyEvents = () => {
        console.log("Events");
        router.replace("/events/myevents");
    };

    const handleScanAction = async () => {
        if (modalType === "create") {
            console.log("Scanning Bill..."); // Handle scanning for Create Bill

            try {
                const url = `http://${ipAddress}/api/owents/make-party/`;
                const data = {
                    transaction_acc_number: cards[0].number,
                };

                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                const contentType = response.headers.get("Content-Type");
                if (contentType && contentType.includes("application/json")) {
                    const result = await response.json();
                    setQrCode(result)
                    console.log("Party created:", result["qr"]);
                } else {
                    const text = await response.text();
                    // console.error("Non-JSON response:", text.split("\n")[0]);
                }
            } catch (error) {
                console.error("Party creation failed:", error);
            }

            router.replace("/bill/scan-bill");
        } else if (modalType === "join") {
            console.log("Scanning QR Code..."); // Handle scanning for Join Bill

            router.replace("/bill/scan-qr");
            // console.log(qrCode)
            // router.replace({
            //     pathname: "/bill/scan-qr",
            //     params: {qr: qrCode},
            // });
        }
        setModalVisible(false); // Close modal after scanning
        // router.replace("/bill/create-bill");
    };

    const handleCreateBill = () => {
        router.replace("/bill/create-bill");
        setModalVisible(false); // Close modal after creating bill
    };

    return (
        <View className="flex-1 items-center justify-between bg-white p-5">
            <Text className="text-2xl font-bold text-text my-4 border-b border-gray-300 py-3">
                Bill Splitting System
            </Text>

            {/* Create Bill and Join Bill Buttons */}
            <View className="flex-1 items-center justify-center">
                <TouchableOpacity
                    className="bg-primary p-6 my-3 rounded-lg items-center shadow-md"
                    onPress={CreateBill}
                >
                    <Text className="text-white text-sm font-semibold">Create Bill</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-primary p-6 my-3 rounded-lg items-center shadow-md"
                    onPress={JoinBill}
                >
                    <Text className="text-white text-sm font-semibold">Join Bill</Text>
                </TouchableOpacity>
            </View>

            {/* Modal for Create Bill or Join Bill */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/40">
                    <View className="bg-white p-5 rounded-lg shadow-lg w-80">
                        <Text className="text-xl font-bold mb-4">
                            {modalType === "create" ? "Create Bill" : "Join Bill"}
                        </Text>

                        {/* Dropdown for selecting card (only visible for Create Bill) */}
                        <Text className="text-lg">Choose Card:</Text>
                        <Picker
                            selectedValue={selectedCard}
                            onValueChange={(itemValue) => setSelectedCard(itemValue)}
                            className="mt-2 border border-gray-300"
                        >
                            {creditCards.map((card) => (
                                <Picker.Item key={card.id} label={card.bank} value={card.id}/>
                            ))}
                        </Picker>

                        {/* Dynamic button based on the modal type */}
                        <TouchableOpacity
                            onPress={handleScanAction}
                            className={`${
                                modalType === "create" ? "bg-green-500" : "bg-blue-500"
                            } p-3 rounded-lg mt-4`}
                        >
                            <Text className="text-white text-center">
                                {modalType === "create" ? "Scan Bill" : "Scan QR-Code"}
                            </Text>
                        </TouchableOpacity>

                        {/* Create Bill Button (only visible for Create Bill) */}
                        {/*{modalType === "create" && (*/}
                        {/*    <TouchableOpacity*/}
                        {/*        onPress={handleCreateBill}*/}
                        {/*        className="bg-blue-500 p-3 rounded-lg mt-4"*/}
                        {/*    >*/}
                        {/*        <Text className="text-white text-center">Create Bill</Text>*/}
                        {/*    </TouchableOpacity>*/}
                        {/*)}*/}

                        {/* Close Modal */}
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            className="absolute top-2 right-2"
                        >
                            <Text className="text-xl text-gray-600">X</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Splitting;
