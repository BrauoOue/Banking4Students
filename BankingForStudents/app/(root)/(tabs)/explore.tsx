import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    Modal,
} from "react-native";
import icons from "@/constants/icons";

const Explore = () => {
    const [activeTab, setActiveTab] = useState("Partnerships");
    const [selectedCard, setSelectedCard] = useState(null);
    const [showQRCode, setShowQRCode] = useState(false);
    const [showEnrollConfirmation, setShowEnrollConfirmation] = useState(false);

    const partnershipsCards = [
        {
            id: 1,
            title: "Spotify",
            img: "https://storage.googleapis.com/pr-newsroom-wp/1/2023/12/Generic-FTR-headers_V10-1920x733.jpg",
            date: "19.03.2025",
            discount: "20% discount",
            points: 100,
        },
        {
            id: 2,
            title: "Netflix",
            img: "https://images.ctfassets.net/4cd45et68cgf/6wHlMkLFTfKk3cQrTYnVLL/bdbbd0da407283d0833aa4575b4e81dd/Netflix_LinkdinHeader_N_Texture_5.png?w=2560",
            date: "20.03.2025",
            discount: "15% discount",
            points: 80,
        },
        {
            id: 3,
            title: "Amazon Prime",
            img: "https://m.media-amazon.com/images/G/01/primevideo/seo/primevideo-seo-logo.png",
            date: "21.03.2025",
            discount: "25% discount",
            points: 120,
        },
    ];

    const servicesCards = [
        {
            id: 1,
            title: "C++ Course",
            date: "19.03.2025",
            duration: "1 month",
            frequency: "2 hours a week",
            points: 100,
            contactInfo: {
                email: "cpp_tutor@example.com",
                phone: "071-890-999",
            },
        },
        {
            id: 2,
            title: "Web Development Workshop",
            date: "22.03.2025",
            duration: "2 weeks",
            frequency: "3 hours a week",
            points: 80,
            contactInfo: {
                email: "webdev_instructor@example.com",
                phone: "072-123-456",
            },
        },
    ];

    const handleClaim = () => {
        setShowQRCode(true);
    };

    const handleEnroll = () => {
        setShowEnrollConfirmation(true);
    };

    const closeModal = () => {
        setSelectedCard(null);
        setShowQRCode(false);
        setShowEnrollConfirmation(false)
    };

    return (
        <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16, backgroundColor:"white" }}>
            {/* Header Tabs */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginBottom: 16,
                }}
            >
                <TouchableOpacity onPress={() => setActiveTab("Partnerships")}>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: activeTab === "Partnerships" ? "bold" : "normal",
                        }}
                    >
                        Partnerships
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab("Services")}>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: activeTab === "Services" ? "bold" : "normal",
                        }}
                    >
                        Services
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Cards Section */}
            <ScrollView>
                {(activeTab === "Partnerships"
                    ? partnershipsCards
                    : servicesCards
                ).map((card) => (
                    <TouchableOpacity
                        key={card.id}
                        style={{
                            backgroundColor: "transparent",
                            marginBottom: 16,
                            borderWidth: 1,
                            borderColor: "#ccc",
                            borderRadius: 12,
                            overflow: "hidden",
                        }}
                        onPress={() => setSelectedCard(card)}
                    >
                        {/* Card Image */}
                        {activeTab === "Partnerships" && (
                            <Image
                                source={{ uri: card.img }}
                                style={{
                                    width: "100%",
                                    height: 100,
                                    borderTopLeftRadius: 0,
                                    borderTopRightRadius: 0,
                                }}
                            />
                        )}

                        {/* Card Content */}
                        <View style={{ padding: 16 }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 8,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "bold",
                                        color: "#333",
                                    }}
                                >
                                    {card.title}
                                </Text>
                                <Text style={{ fontSize: 14, color: "#666" }}>
                                    {card.date}
                                </Text>
                            </View>

                            {/* Description */}
                            {activeTab === "Partnerships" ? (
                                <Text style={{ fontSize: 16, color: "#555", marginBottom: 8 }}>
                                    {card.discount}
                                </Text>
                            ) : (
                                <View>
                                    <Text
                                        style={{ fontSize: 16, color: "#555", marginBottom: 4 }}
                                    >
                                        {card.duration}
                                    </Text>
                                    <Text
                                        style={{ fontSize: 16, color: "#555", marginBottom: 4 }}
                                    >
                                        {card.frequency}
                                    </Text>
                                </View>
                            )}

                            {/* Points */}
                            <View style={{ alignItems: "flex-end" }}>
                                <Text style={{ fontSize: 14, color: "#666" }}>
                                    {card.points}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Modal for Card Details */}
            {selectedCard && (
                <Modal transparent={true} animationType="slide">
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0,0,0,0.5)",
                        }}
                    >
                        <View
                            style={{
                                width: "80%",
                                backgroundColor: "#fff",
                                borderRadius: 8,
                                padding: 16,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    marginBottom: 8,
                                }}
                            >
                                {selectedCard.title}
                            </Text>
                            {activeTab === "Partnerships" ? (
                                <>
                                    <Image
                                        source={{ uri: selectedCard.img }}
                                        style={{
                                            width: "100%",
                                            height: 150,
                                            marginBottom: 8,
                                            borderRadius: 8,
                                        }}
                                    />
                                    <Text>{selectedCard.discount}</Text>
                                    <Text>{selectedCard.date}</Text>
                                    <Text>-{selectedCard.points}</Text>

                                </>
                            ) : (
                                <>
                                    <Text>Duration: {selectedCard.duration}</Text>
                                    <Text>Frequency: {selectedCard.frequency}</Text>
                                    <Text>Price: {selectedCard.points} points</Text>
                                    <Text>Applicable until: {selectedCard.date}</Text>
                                    <TouchableOpacity
                                        onPress={handleEnroll}
                                        style={{
                                            backgroundColor: "#007BFF",
                                            padding: 8,
                                            borderRadius: 4,
                                            marginTop: 16,
                                        }}
                                    >
                                        <Text style={{ color: "#fff", textAlign: "center" }}>
                                            Enroll
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                            <TouchableOpacity
                                onPress={closeModal}
                                style={{
                                    backgroundColor: "#ccc",
                                    padding: 8,
                                    borderRadius: 4,
                                    marginTop: 16,
                                }}
                            >
                                <Text style={{ color: "#fff", textAlign: "center" }}>
                                    Close
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
            {/* Confirmation Modal */}
            {showEnrollConfirmation && selectedCard && (
                <Modal transparent={true} animationType="slide">
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0,0,0,0.5)",
                        }}
                    >
                        <View
                            style={{
                                width: "80%",
                                backgroundColor: "#fff",
                                borderRadius: 8,
                                padding: 16,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    marginBottom: 8,
                                    textAlign: "center",
                                }}
                            >
                                Confirmation
                            </Text>
                            <Text style={{ textAlign: "center", marginBottom: 16 }}>
                                Congrats, you enrolled in the {selectedCard.title}!
                            </Text>
                            <Text style={{ textAlign: "center", marginBottom: 16 }}>
                                Contact tutor:
                            </Text>
                            <Text style={{ textAlign: "center", marginBottom: 8 }}>
                                Email: {selectedCard.contactInfo?.email}
                            </Text>
                            <Text style={{ textAlign: "center", marginBottom: 8 }}>
                                Phone: {selectedCard.contactInfo?.phone}
                            </Text>
                            <TouchableOpacity
                                onPress={closeModal}
                                style={{
                                    backgroundColor: "#007BFF",
                                    padding: 8,
                                    borderRadius: 4,
                                }}
                            >
                                <Text style={{ color: "#fff", textAlign: "center" }}>
                                    Close
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

export default Explore;
