import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

const Profile = () => {
  const user = {
    name: "Филипс Комитоски",
    email: "bravo.be.philips@hotmail.com",
    accountNumber: "**** 0069",
    balance: "5,240.00 ден.",
  };

  const handleLogout = () => {
    console.log("Sakam motor so krilja!");
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-5">
      {/* Profile Image */}
      <Image
        source={{ uri: "https://via.placeholder.com/100" }}
        className="w-24 h-24 rounded-full mb-4"
      />

      {/* User Info */}
      <Text className="text-2xl font-bold text-gray-900">{user.name}</Text>
      <Text className="text-lg text-gray-500 mb-4">{user.email}</Text>

      {/* Account Information */}
      <View className="w-full bg-white p-5 rounded-lg shadow-xl shadow-primary mb-5">
        <Text className="text-gray-500 font-semibold">Account Number</Text>
        <Text className="text-lg font-medium text-gray-900">{user.accountNumber}</Text>

        <Text className="text-gray-500 font-semibold mt-3">Balance</Text>
        <Text className="text-2xl font-bold text-green-600">{user.balance}</Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        className="bg-accent px-6 py-3 rounded-lg w-full"
        onPress={handleLogout}
      >
        <Text className="text-white text-center font-semibold text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
