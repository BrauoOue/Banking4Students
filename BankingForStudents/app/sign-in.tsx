import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Alert, Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {Picker} from "@react-native-picker/picker";
import {useRouter} from "expo-router";

import images from "@/constants/images.ts";
import {useGlobalContext} from "@/lib/global-provider";

const SignIn = () => {
    const router = useRouter();
    const {isLogged, setIsLogged, setUser, ipAddress} = useGlobalContext();
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(2);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `http://${ipAddress}/api/main/user-list/`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const data = await response.json();
                setUsers(data);
                setSelectedUserId(data[0].id)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleLogin = async () => {
        const selectedUser = users.find((user) => user.id === selectedUserId);
        if (!selectedUser) {
            Alert.alert("Error", "Please select a user before logging in.");
            return;
        }

        setUser(selectedUser);
        setIsLogged(true);
        router.replace("/");
    };

    return (
        <SafeAreaView className="bg-white h-full">
            <ScrollView contentContainerStyle={{flexGrow: 1,}}>
                <View className="flex justify-center items-center mt-[12vh]">
                    <Image source={images.logo} className="w-2/3 h-10/23" resizeMode="contain"/>
                </View>

                <View className="px-10">
                    <Text className="text-base text-center uppercase font-rubik text-black-200">
                        Welcome To Banking for Students
                    </Text>

                    <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
                        Let's Make Students' Lives {"\n"}
                        <Text className="text-primary-300 text-primary">Easier</Text>
                    </Text>

                    <Text className="text-lg font-rubik text-black-200 text-center mt-12">
                        Login to Halkbank with OneID
                    </Text>

                    {/* Dropdown for Selecting User */}
                    <View className="border border-gray-300 rounded-lg mt-4 mb-2">
                        <Picker
                            selectedValue={selectedUserId}
                            onValueChange={(itemValue) => setSelectedUserId(itemValue)}
                            style={{height: 50, width: '100%'}}
                        >
                            {users.map((u) => (
                                <Picker.Item
                                    key={u.id}
                                    label={`${u.name} ${u.surname}`}
                                    value={u.id}
                                />
                            ))}
                        </Picker>
                    </View>

                    {/* Continue with OneID Button */}
                    <TouchableOpacity
                        onPress={handleLogin}
                        className="bg-white shadow-xl shadow-primary rounded-full w-full py-4 mt-5"
                    >
                        <View className="flex flex-row items-center justify-center">
                            <Image source={images.oneidlogo} className="w-8 h-8" resizeMode="contain"/>
                            <Text className="text-lg font-rubik-medium text-black-300 ml-2">
                                Continue with OneID
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;