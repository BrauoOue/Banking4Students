import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image
} from 'react-native';
import icons from "@/constants/icons";  // Assuming this is the correct path

const Notifications = () => {

  const notificationsData = [
    {
      id: '1',
      message: 'Nikola has invited you to VC',
      type: 'invite',
    },
    {
      id: '2',
      message: 'Gorazd has requested $10',
      type: 'request',
    },
    {
      id: '3',
      message: 'Andrea bought your service',
      type: 'purchase',
    },
  ];

  const renderNotificationItem = (item) => {
    let buttons;

    switch (item.type) {
      case 'invite':
        buttons = (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.acceptButton]}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.declineButton]}>
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        );
        break;
      case 'request':
        buttons = (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.acceptButton]}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.declineButton]}>
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        );
        break;
      case 'purchase':
        buttons = (
          <TouchableOpacity style={[styles.button, styles.contactButton]}>
            <Text style={styles.buttonText}>Contact</Text>
          </TouchableOpacity>
        );
        break;
      default:
        buttons = null;
    }

    return (
      <View key={item.id} style={styles.notificationItem}>
        <Text style={styles.notificationText}>{item.message}</Text>
        {buttons}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/*  Replace with your actual logo image */}
        <Image
          source={{ uri: 'url_to_your_logo' }} // Replace with your actual logo image
          style={styles.logo}
        />
        <View style={styles.balance}>
          <Text style={styles.balanceText}>Notifications</Text> {/* Changed Header Text */}
        </View>
      </View>

      {/* Content (Notifications) */}
      <ScrollView style={styles.content}>
        {notificationsData.map(renderNotificationItem)}
      </ScrollView>

      {/* Bottom Navigation Bar (Placeholder) */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity>
          {/* Replace with your actual navigation icon image */}
          <Image
            source={{ uri: 'url_to_home_icon' }} // Replace with your actual navigation icon
            style={styles.navItem}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          {/* Replace with your actual navigation icon image */}
          <Image
            source={{ uri: 'url_to_settings_icon' }} // Replace with your actual navigation icon
            style={styles.navItem}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // A softer background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },  
  logo: {
    width: 30,
    height: 30, // Gray placeholder
  },
  balance: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceText: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1, // Makes sure title stays in the center
    textAlign: "center", // Keeps it centered
    marginLeft: -270, // Moves it slightly left, adjust as needed
  },  
  content: {
    padding: 16,
  },
  notificationItem: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  notificationText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#54af54',
  },
  declineButton: {
    backgroundColor: '#ee5e5e',
  },
  contactButton: {
    backgroundColor: '#1b81c3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomNavBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  navItem: {
    width: 30,
    height: 30,
  },
});

export default Notifications;
