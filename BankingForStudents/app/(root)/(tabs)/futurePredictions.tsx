import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import icons from "@/constants/icons";

const FuturePredictions = () => {
  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Unlock Your Financial Future</Text>

        {/* Section 1: Average Spending per Month */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Spending Snapshot</Text>
          <Text style={styles.sectionSubtitle}>
            Where your money goes, month by month.
          </Text>
          {/* Corrected Image Component */}
          <View style={styles.chartPlaceholder}>
            <Image
              source={{
                uri: "https://content.nroc.org/DevelopmentalMath/COURSE_TEXT2_RESOURCE/U08_L1_T2_text_final_2_files/image002.gif",
              }}
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            />
          </View>
        </View>

        {/* Section 2: Prediction Based on Current Rate */}
        <View style={styles.section}>
          <Text style={styles.predictionTitle}>Projected Growth:</Text>
          <Text style={styles.predictionText}>
            Based on your current trajectory, you're on track for a 10% daily
            gain. At this rate, you could double your money by the end of the
            year!
          </Text>
          {/* Placeholder for line chart image */}
          <View style={styles.chartPlaceholder}>
            <Image
              source={{
                uri: "https://images.saymedia-content.com/.image/ar_16:9%2Cc_fill%2Ccs_srgb%2Cq_auto:eco%2Cw_1200/MTc0MTYyMTE1NzA2NDMwOTcy/how-to-draw-a-scientific-graph.gif",
              }}
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            />
          </View>
        </View>

        {/* Section 3: Money by the end of the Month */}
        <View style={styles.section}>
          <Text style={styles.predictionTitle}>
            Money By The End of The Month
          </Text>
          <Text style={styles.predictionText}>
            Based on your spending habits, income and predicted bills, by the
            end of the month you will have: 1300€
          </Text>
          {/* Placeholder for line chart image */}
          <View style={styles.chartPlaceholder}>
            <Image
              source={{
                uri: "https://chrisreining.com/wp-content/uploads/2020/03/NFLX-e1584971112420.png",
              }}
              style={{ width: "100%", height: "100%", resizeMode: "contain" }}
            />
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
    backgroundColor: "white", // A softer background
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    fontWeight: "600", // Slightly bolder
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28, // Larger and bolder title
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333", // Darker color for emphasis
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#fff", // White cards for sections
    padding: 16,
    borderRadius: 8, // Rounded corners
    shadowColor: "#000", // Subtle shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20, // Slightly larger section titles
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#666", // A bit lighter
    marginBottom: 12,
  },
  chartPlaceholder: {
    height: 250,
    marginBottom: 12,
    borderRadius: 6,
    // Remove or change the backgroundColor if needed
  },
  predictionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  predictionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
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
    backgroundColor: "#ddd", // Gray placeholder
  },
  lstmExplanationText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  lstmSubheading: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
  },
  lstmText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
});

export default FuturePredictions;
