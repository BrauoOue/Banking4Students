import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const MyUniPage = () => {
    const [selectedDocument, setSelectedDocument] = useState("");
    const [documentPrice, setDocumentPrice] = useState(0);

    const documentOptions = [
        { label: "Select Document", value: "" },
        { label: "Tuition Invoice", value: "tuition", price: 10 },
        { label: "Course Change Request", value: "courseChange", price: 15 },
        { label: "Transcript of Records", value: "transcript", price: 20 },
        { label: "Enrollment Certificate", value: "enrollment", price: 12 },
    ];

    const handleDocumentChange = (itemValue) => {
        setSelectedDocument(itemValue);
        const selectedDoc = documentOptions.find(
            (doc) => doc.value === itemValue
        );
        setDocumentPrice(selectedDoc ? selectedDoc.price || 0 : 0);
    };

    const handlePay = () => {
        // Implement your payment logic here
        alert(`Paying $${documentPrice} for ${selectedDocument}`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Form for Uni Documents</Text>

                {/* Document Dropdown */}
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedDocument}
                        onValueChange={handleDocumentChange}
                        style={styles.picker}
                    >
                        {documentOptions.map((doc, index) => (
                            <Picker.Item
                                key={index}
                                label={doc.label}
                                value={doc.value}
                            />
                        ))}
                    </Picker>
                </View>

                {/* Display Price */}
                {selectedDocument !== "" && (
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>Price:</Text>
                        <TextInput
                            style={styles.priceInput}
                            value={`$${documentPrice}`}
                            editable={false}
                        />
                    </View>
                )}

                {/* Pay Button */}
                {selectedDocument !== "" && (
                    <TouchableOpacity style={styles.payButton} onPress={handlePay}>
                        <Text style={styles.payButtonText}>Pay</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
    },
    formContainer: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 20,
        overflow: "hidden",
    },
    picker: {
        height: 40,
        color: "black",
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    priceText: {
        fontSize: 16,
        marginRight: 10,
    },
    priceInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        width: "50%",
        backgroundColor: "#f9f9f9",
        color: "#555",
    },
    payButton: {
        backgroundColor: "#007BFF",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    payButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default MyUniPage;
