import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";

const Grants = () => {
  const grantCards = [
    {
      id: 1,
      title: "SORSIX",
      img: { uri: "https://www.i-hd.eu/wp-content/uploads/2023/11/Sorsix-transparent.png" },
      description: "Get your first investment for your business",
      amount: "$10000.00",
    },
    {
      id: 2,
      title: "SORSIX",
      img: { uri: "https://www.i-hd.eu/wp-content/uploads/2023/11/Sorsix-transparent.png" },
      description: "Get your first investment for your business",
      amount: "$10000.00",
    },
    {
      id: 3,
      title: "SORSIX",
      img: { uri: "https://www.i-hd.eu/wp-content/uploads/2023/11/Sorsix-transparent.png" },
      description: "Get your first investment for your business",
      amount: "$10000.00",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        {grantCards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={styles.card}
            onPress={() => {
              // Do nothing when pressed
            }}
          >
            <Image source={card.img} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardDescription}>{card.description}</Text>
              <Text style={styles.cardAmount}>{card.amount}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  card: {
    backgroundColor: "white",
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
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  cardAmount: {
    fontSize: 16,
    color: "#666",
  },
});

export default Grants;
