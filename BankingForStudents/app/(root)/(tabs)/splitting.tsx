import React, {useState} from "react";
import {Modal, View, Text, TouchableOpacity} from "react-native";
import {useRouter} from "expo-router";
import {Picker} from "@react-native-picker/picker";

const Splitting = () => {
    const [modalVisible, setModalVisible] = useState(false); // Track modal visibility
    const [selectedCard, setSelectedCard] = useState(null); // Track selected card
    const [modalType, setModalType] = useState(""); // Track whether it's Create or Join Bill
    const router = useRouter();

    const creditCards = [
        {id: "1", bank: "Visa"},
        {id: "2", bank: "MasterCard"},
        {id: "3", bank: "Amex"},
    ];

    const CreateBill = () => {
        setModalType("create"); // Set modal type to "create" when Create Bill is clicked
        setModalVisible(true);  // Show modal
    };

    const JoinBill = () => {
        setModalType("join"); // Set modal type to "join" when Join Bill is clicked
        setModalVisible(true);  // Show modal
    };

    const MyEvents = () => {
        console.log("Events")
        router.replace("/events/myevents");
    };

    const handleScanAction = () => {
        if (modalType === "create") {
            console.log("Scanning Bill..."); // Handle scanning for Create Bill
        } else if (modalType === "join") {
            console.log("Scanning QR Code..."); // Handle scanning for Join Bill
        }
        setModalVisible(false); // Close modal after scanning
        router.replace("/bill/create-bill");
    };

    const handleCreateBill = () => {
        router.replace("/bill/create-bill");
        setModalVisible(false); // Close modal after creating bill
    };

    return (
        <View className="flex-1 items-center justify-between bg-white p-5">
            <Text className="text-2xl font-bold text-text my-4 border-b border-gray-300 py-3">Bill Splitting
                System</Text>

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
                        <Text
                            className="text-xl font-bold mb-4">{modalType === "create" ? "Create Bill" : "Join Bill"}</Text>

                        {/* Dropdown for selecting card (only visible for Create Bill) */}
                        <Text className="text-lg">Choose Card:</Text>
                        <Picker
                            selectedValue={selectedCard}
                            onValueChange={(itemValue) => setSelectedCard(itemValue)}
                            className="mt-2"
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
