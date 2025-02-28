import React from "react";
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const DATA = Array.from({ length: 20 }, (_, i) => ({ id: i, title: `Card ${i + 1}` }));

const HomeScreen = () => (
  <SafeAreaView style={{ flex: 1, padding: 10 }}>
    <FlatList
      data={DATA}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View
          style={{
            backgroundColor: "#f8f9fa",
            padding: 20,
            marginVertical: 8,
            borderRadius: 10,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 18 }}>{item.title}</Text>
        </View>
      )}
    />
  </SafeAreaView>
);

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ height: 60, backgroundColor: "#007bff", justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>HALKBANK HACKATHON</Text>
        </View>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === "Home") iconName = "home";
              else if (route.name === "Settings") iconName = "settings";
              else if (route.name === "Profile") iconName = "person";
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Settings" component={() => <Text>Settings Screen</Text>} />
          <Tab.Screen name="Profile" component={() => <Text>Profile Screen</Text>} />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}
