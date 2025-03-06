import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import icons from "@/constants/icons";

const Profile = () => {
    const user = {
        name: "Филипс Комитоски",
        email: "bravo.be.philips@hotmail.com",
        accountNumber: "**** 0069",
        balance: "5,240.00 ден.",
        profileImage:
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    };

    const menuItems = [
        { id: "notifications", label: "Notifications", icon: "bell", route: "/notifications" },
        { id: "transactions", label: "My Transactions", icon: "transaction", route: "/transactions" },
        { id: "university", label: "My University", icon: "uni", route: "/my_uni" },
        { id: "subscriptions", label: "Subscriptions", icon: "subscription", route: "/subscriptions" },
        { id: "cashStuffing", label: "Cash stuffing", icon: "cash", route: "/cashstuffing" },
        { id: "grants", label: "My Grants", icon: "grant", route: "/grants" },
        {
            id: "futurePredictions",
            label: "Future Predictions",
            icon: "bell",
            route: "/futurePredictions",
        },
    ];  

    const handleLogout = () => {
        console.log("Sakam motor so krilja!");
    };

    const router = useRouter();

    return (
        <ScrollView style={styles.container}>
            {/* Profile Header */}
            <View style={styles.header}>
                <Image
                    source={{ uri: user.profileImage }}
                    style={styles.profileImage}
                />
                <View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                </View>
            </View>

            {/* Account Information */}
            <View style={styles.accountInfo}>
                <View style={styles.accountItem}>
                    <Text style={styles.accountLabel}>Account Number</Text>
                    <Text style={styles.accountValue}>{user.accountNumber}</Text>
                </View>
                <View style={styles.accountItem}>
                    <Text style={styles.accountLabel}>Balance</Text>
                    <Text style={styles.accountValue}>{user.balance}</Text>
                </View>
            </View>

            {/* Menu Items */}
            <View style={styles.menu}>
                {menuItems.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.menuItem}
                        onPress={() => router.push(item.route)} // Use router.push to navigate
                    >
                        <Image
                            source={icons[item.icon]} // Use the icon from the dictionary
                            style={styles.menuItemIcon}
                        />
                        <Text style={styles.menuItemText}>{item.label}</Text>
                        <Image source={icons.rightArrow} style={styles.menuItemArrow} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    userName: {
        fontSize: 22,
        fontWeight: "600",
        color: "#333",
    },
    userEmail: {
        fontSize: 16,
        color: "gray",
    },
    accountInfo: {
        backgroundColor: "white",
        borderRadius: 10,
        marginBottom: 20,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    accountItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    accountLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#555",
    },
    accountValue: {
        fontSize: 16,
        color: "#333",
    },
    menu: {
        backgroundColor: "white",
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    menuItemIcon: {
        marginRight: 10,
        marginLeft: 15, // Push icon to the right
        width: 24, // Adjust size as needed
        height: 24, // Adjust size as needed
        resizeMode: "contain", // Ensure the image fits within the specified dimensions
    },
    menuItemText: {
        fontSize: 18,
        color: "#333",
        flex: 1,
    },
    menuItemArrow: {
        // Style for the arrow icon, if needed
        width: 24, // Adjust size as needed
        height: 24, // Adjust size as needed
        resizeMode: "contain", // Ensure the image fits within the specified dimensions
    },
    logoutButton: {
        backgroundColor: "#FF6347", // Tomato color for Logout
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    logoutButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default Profile;
