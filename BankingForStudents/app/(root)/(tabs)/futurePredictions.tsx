import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const FuturePredictions = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logo}></View>
        <View style={styles.balance}>
          <Text>121</Text>
          {/* Add your coin icon here */}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Predict my financial future</Text>

        {/* Section 1: Average Spending per Month */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Average spending per month</Text>
          {/* Placeholder for bar chart image */}
          <View style={styles.chartPlaceholder}>
            {/* You will add your bar chart image here */}
          </View>
        </View>

        {/* Section 2: Prediction Based on Current Rate */}
        <View style={styles.section}>
          <Text style={styles.predictionText}>
            At this rate you are gaining 10% every day.
            By the end of the year you will double your money
          </Text>
          {/* Placeholder for line chart image */}
          <View style={styles.chartPlaceholder}>
            {/* You will add your line chart image here */}
          </View>
        </View>

       

      </ScrollView>

      {/* Bottom Navigation Bar (Placeholder) */}
      <View style={styles.bottomNavBar}>
          <View style={styles.navItem}></View>
          <View style={styles.navItem}></View>
          <View style={styles.navItem}></View>
          <View style={styles.navItem}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 30,
    height: 30,
    backgroundColor: '#ddd', // Gray placeholder
  },
  balance: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chartPlaceholder: {
    height: 150,
    backgroundColor: '#eee', // Light gray placeholder
    marginBottom: 12,
  },
  predictionText: {
    fontSize: 16,
    marginBottom: 12,
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navItem: {
    width: 30,
    height: 30,
    backgroundColor: '#ddd', // Gray placeholder
  },
});

export default FuturePredictions;
