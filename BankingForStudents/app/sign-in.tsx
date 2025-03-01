import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useRouter } from "expo-router";

import images from "@/constants/images.ts";
import {useGlobalContext} from "@/lib/global-provider";

const SignIn = () => {
    const router = useRouter();
    const { isLogged, setIsLogged } = useGlobalContext();

    const handleLogin = async () => {
        setIsLogged(true)
        router.push("/"); // Redirect to Home
    };

    return (
        <SafeAreaView className="bg-white h-full pt-[20vh]">
            <ScrollView
                contentContainerStyle={{
                    height: "100vh",
                }}
            >
                <Image
                    source={images.logo}
                    className="w-full h-4/6"
                    resizeMode="contain"
                />

                <View className="px-10">
                    <Text className="text-base text-center uppercase font-rubik text-black-200">
                        Welcome To Banking for Students
                    </Text>

                    <Text className="text-3xl font-rubik-bold text-black-300 text-center mt-2">
                        Let's Make Students Lifes {"\n"}
                        <Text className="text-primary-300 text-primary">Easier</Text>
                    </Text>

                    <Text className="text-lg font-rubik text-black-200 text-center mt-12">
                        Login to Halkbank with OneID
                    </Text>

                    <TouchableOpacity
                        onPress={handleLogin}
                        className="bg-white shadow-xl shadow-primary rounded-full w-full py-4 mt-5"
                    >
                        <View className="flex flex-row items-center justify-center">
                            <Image
                                source={images.oneidlogo}
                                className="w-8 h-8"
                                resizeMode="contain"
                            />
                            <Text className="text-lg font-rubik-medium text-black-300 ml-2">
                                Continue with OneID
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default SignIn
