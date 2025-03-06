import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';

const SubscriptionItem = ({ name, date, price, url, icon }) => {
  // Function to open the URL
  const openURL = () => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.card}>
      {/* Subscription Icon */}
      <Image source={{ uri: icon }} style={styles.icon} />

      {/* Subscription Details */}
      <View style={styles.details}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      <Text style={styles.price}>${price}</Text>

      {/* Open URL Button
      <TouchableOpacity onPress={openURL} style={styles.openButton}>
        <Text style={styles.openButtonText}>🔗</Text>
      </TouchableOpacity> */}

      {/* Delete Button */}
      <TouchableOpacity onPress={openURL} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const SubscriptionsScreen = () => {
  const subscriptions = [
    {
      id: 1,
      name: 'Spotify',
      date: '25 Feb',
      price: '20',
      url: 'https://www.spotify.com',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1200px-Spotify_icon.svg.png', // Replace with actual Spotify icon
    },
    {
      id: 2,
      name: 'Facebook',
      date: '1 March',
      price: '10',
      url: 'https://www.facebook.com',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png', // Replace with actual Facebook icon
    },
    {
      id: 3,
      name: 'GitHub',
      date: '28 Feb',
      price: '20',
      url: 'https://www.github.com',
      icon: 'https://cdn-icons-png.flaticon.com/512/25/25231.png', // Replace with actual GitHub icon
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Subscriptions</Text>
      {subscriptions.map((sub) => (
        <SubscriptionItem
          key={sub.id}
          name={sub.name}
          date={sub.date}
          price={sub.price}
          url={sub.url}
          icon={sub.icon}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  openButton: {
    padding: 10,
  },
  openButtonText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#1b81c3',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SubscriptionsScreen;
