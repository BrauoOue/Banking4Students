import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  StyleSheet,
} from "react-native";
import icons from "@/constants/icons";

const Explore = () => {
  const [activeTab, setActiveTab] = useState("Partnerships");
  const [selectedCard, setSelectedCard] = useState(null);
  const [modalState, setModalState] = useState("details"); // "details", "qrcode", or "confirmation"

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
    setModalState("qrcode");
  };

  const handleEnroll = () => {
    setModalState("confirmation");
  };

  const closeModal = () => {
    setSelectedCard(null);
    setModalState("details");
  };

  return (
    <View style={styles.container}>
      {/* Header Tabs */}
      <View style={styles.headerTabs}>
        <TouchableOpacity onPress={() => setActiveTab("Partnerships")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "Partnerships" && styles.activeTabText,
            ]}
          >
            Partnerships
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab("Services")}>
          <Text
            style={[
              styles.tabText,
              activeTab === "Services" && styles.activeTabText,
            ]}
          >
            Services
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cards Section */}
      <ScrollView>
        {(activeTab === "Partnerships" ? partnershipsCards : servicesCards).map(
          (card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.card}
              onPress={() => {
                setSelectedCard(card);
                setModalState("details");
              }}
            >
              {/* Card Image */}
              {activeTab === "Partnerships" && (
                <Image source={{ uri: card.img }} style={styles.cardImage} />
              )}

              {/* Card Content */}
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardDate}>{card.date}</Text>

                {/* Description */}
                {activeTab === "Partnerships" ? (
                  <Text style={styles.cardDescription}>{card.discount}</Text>
                ) : (
                  <View>
                    <Text style={styles.cardDescription}>{card.duration}</Text>
                    <Text style={styles.cardDescription}>{card.frequency}</Text>
                  </View>
                )}

                {/* Points */}
                <Text style={styles.cardPoints}>
                  {card.points}
                  <Image source={icons.coins} style={styles.coinIcon} />
                </Text>
              </View>
            </TouchableOpacity>
          )
        )}
      </ScrollView>

      {/* Single Modal with Different Content Based on State */}
      {selectedCard && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* Details State */}
              {modalState === "details" && (
                <>
                  <Text style={styles.modalTitle}>{selectedCard.title}</Text>

                  {activeTab === "Partnerships" ? (
                    <>
                      <Image
                        source={{ uri: selectedCard.img }}
                        style={styles.modalImage}
                      />
                      <Text>{selectedCard.discount}</Text>
                      <Text>{selectedCard.date}</Text>
                      <Text>- {selectedCard.points} </Text>
                      <TouchableOpacity
                        style={styles.claimButton}
                        onPress={handleClaim}
                      >
                        <Text style={styles.claimButtonText}>Claim</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Text>Duration: {selectedCard.duration}</Text>
                      <Text>Frequency: {selectedCard.frequency}</Text>
                      <Text>Price: {selectedCard.points} </Text>
                      <Text>Applicable until: {selectedCard.date}</Text>
                      <TouchableOpacity
                        style={styles.enrollButton}
                        onPress={handleEnroll}
                      >
                        <Text style={styles.enrollButtonText}>Enroll</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </>
              )}

              {/* QR Code State */}
              {modalState === "qrcode" && (
                <>
                  <Text style={styles.modalTitle}>QR Code</Text>
                  <Image
                    source={{
                      uri: "https://blog.tcea.org/wp-content/uploads/2022/05/qrcode_tcea.org-1.png",
                    }}
                    style={styles.qrCodeImage}
                  />
                </>
              )}

              {/* Confirmation State */}
              {modalState === "confirmation" && (
                <>
                  <Text style={styles.modalTitle}>Confirmation</Text>
                  <Text>
                    Congrats, you enrolled in the {selectedCard.title}!
                  </Text>
                  <Text>Contact tutor:</Text>
                  <Text>Email: {selectedCard.contactInfo?.email}</Text>
                  <Text>Phone: {selectedCard.contactInfo?.phone}</Text>
                </>
              )}

              {/* Close Button (appears in all states) */}
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "white",
  },
  headerTabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  tabText: {
    fontSize: 18,
    fontWeight: "normal",
  },
  activeTabText: {
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "transparent",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardDate: {
    fontSize: 14,
    color: "#666",
  },
  cardDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  cardPoints: {
    fontSize: 14,
    color: "#666",
  },
  coinIcon: {
    width: 10,
    height: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalImage: {
    width: "100%",
    height: 150,
    marginBottom: 16,
    borderRadius: 8,
  },
  claimButton: {
    backgroundColor: "#007BFF",
    padding: 8,
    borderRadius: 4,
    marginTop: 16,
    width: "100%",
  },
  claimButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  enrollButton: {
    backgroundColor: "#007BFF",
    padding: 8,
    borderRadius: 4,
    marginTop: 16,
    width: "100%",
  },
  enrollButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    marginTop: 16,
    width: "100%",
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  qrCodeImage: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
});

export default Explore;
