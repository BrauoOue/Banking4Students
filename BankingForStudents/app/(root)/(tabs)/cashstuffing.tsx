import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Button,
} from "react-native";

const CashStuffing = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Ticket to Paris", price: 120, saved: 70, monthlySave: 20 },
    { id: 2, name: "Nike Air Max 270s", price: 159.99, saved: 100, monthlySave: 20 },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState(""); // Renamed and repurposed for the total goal amount
  const [frequency, setFrequency] = useState("monthly");
  const [amountPerFrequency, setAmountPerFrequency] = useState(""); // Renamed for clarity

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleAddGoal = () => {
    // Validation - Check for empty fields
    if (!newGoalName || !newGoalTarget || !amountPerFrequency) {
      alert("Please fill in all fields.");
      return;
    }

    const newGoal = {
      id: Date.now(),
      name: newGoalName,
      price: parseFloat(newGoalTarget), //Total goal amount
      saved: 0, // Initialize saved amount to 0
      monthlySave: frequency === "monthly" ? parseFloat(amountPerFrequency) : 0, //set the right monthly save value
      weeklySave: frequency === "weekly" ? parseFloat(amountPerFrequency) : 0 //set the right weekly save value
    };

    setItems([...items, newGoal]);

    // Clear the form
    setNewGoalName("");
    setNewGoalTarget("");
    setFrequency("monthly");
    setAmountPerFrequency("");

    toggleModal();
  };

  const handleSave = (itemId) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, saved: item.saved + item.monthlySave } : item
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Cash Stuffing</Text>
        <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {items.map((item) => (
          <View style={styles.card} key={item.id}>
            <View style={styles.cardRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>€{item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.savedAmount}>€{item.saved}</Text>
              <Text style={styles.monthlySave}>€{item.monthlySave}/month</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${(item.saved / item.price) * 100}%` },
                ]}
              />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={() => handleSave(item.id)}>
              <Text style={styles.saveButtonText}>M Save</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Modal for Adding New Goal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Goal</Text>

            <TextInput
              style={styles.input}
              placeholder="Goal Name (e.g., Nike Pro 270)"
              value={newGoalName}
              onChangeText={setNewGoalName}
              placeholderTextColor="grey"
            />
            <TextInput
              style={styles.input}
              placeholder="Goal Amount (e.g., 250)"
              keyboardType="numeric"
              value={newGoalTarget}
              onChangeText={setNewGoalTarget}
              placeholderTextColor="grey"
            />

            <View style={styles.frequencyContainer}>
              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  frequency === "monthly" && styles.frequencyButtonActive,
                ]}
                onPress={() => setFrequency("monthly")}
              >
                <Text
                  style={[
                    styles.frequencyText,
                    frequency === "monthly" && styles.frequencyTextActive,
                  ]}
                >
                  Monthly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.frequencyButton,
                  frequency === "weekly" && styles.frequencyButtonActive,
                ]}
                onPress={() => setFrequency("weekly")}
              >
                <Text
                  style={[
                    styles.frequencyText,
                    frequency === "weekly" && styles.frequencyTextActive,
                  ]}
                >
                  Weekly
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Amount per Frequency (e.g., 30)"
              keyboardType="numeric"
              value={amountPerFrequency}
              placeholderTextColor="grey"
              onChangeText={setAmountPerFrequency}
            />

            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={toggleModal} color="#888" />
              <Button title="Add Goal" onPress={handleAddGoal} color="#4caf50" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#87CEEB", // Light blue
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemPrice: {
    fontSize: 18,
    color: "#555",
  },
  savedAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  monthlySave: {
    fontSize: 16,
    color: "#555",
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 15,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4caf50", // Green for progress
  },
  saveButton: {
    backgroundColor: "#87CEEB", // Light blue for Save button
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "black",
    
  },
  frequencyContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 15,
  },
  frequencyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#eee",
  },
  frequencyButtonActive: {
    backgroundColor: "#87CEEB", // Highlight when selected
  },
  frequencyText: {
    fontSize: 16,
    color: "#555",
  },
  frequencyTextActive: {
    color: "black",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});

export default CashStuffing;
