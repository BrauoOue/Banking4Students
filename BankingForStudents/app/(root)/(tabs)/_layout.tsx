import {Tabs} from "expo-router";
import {Image, ImageSourcePropType, Text, View, TouchableOpacity} from "react-native";
import icons from "@/constants/icons";
import images from "@/constants/images";

const TabIcon = ({
                     focused,
                     icon,
                     title,
                 }: {
    focused: boolean;
    icon: ImageSourcePropType;
    title: string;
}) => (
    <View className="flex-1 mt-3 flex flex-col items-center">
        <Image
            source={icon}
            tintColor={focused ? "#0061FF" : "#666876"}
            resizeMode="contain"
            className="size-6"
        />
        <Text
            className={`${
                focused
                    ? "text-primary-300 font-rubik-medium"
                    : "text-black-200 font-rubik"
            } text-xs w-full text-center mt-1`}
        >
            {title}
        </Text>
    </View>
);

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: "white",
                    position: "absolute",
                    borderTopColor: "#0061FF1A",
                    borderTopWidth: 1,
                    minHeight: 70,
                },
                headerStyle: {
                    backgroundColor: "white",
                    height: 45, // Adjusted height for iOS
                    borderBottomWidth: 1,
                    borderBottomColor: "#0061FF1A",
                },
                headerTitleAlign: "center", // Ensures left alignment on iOS
                headerTitle: () => (
                    <View className="flex-1 flex-row items-center justify-between w-[100%] px-2">
                        {/* Left Side - Logo */}
                        <Image source={images.logo} className="w-24 h-10" resizeMode="contain"/>

                        {/* Right Side - Number & Icon */}
                        <View className="flex-row items-center">
                            <Text className="text-lg font-rubik-bold text-black-300 mr-2">121</Text>
                            <TouchableOpacity>
                                <Image source={icons.coins} className="w-6 h-6" resizeMode="contain"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                ),

            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.home} title="Home"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="splitting"
                options={{
                    title: "Bill Splitting",
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.receipt} title="Bill Splitting"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="events/myevents"
                options={{
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.event} title="Events"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: "Explore",
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.compass} title="Explore"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.person} title="Profile"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="events/[id]"
                options={{
                    href: null,
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.person} title="events/[id]"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="events/new"
                options={{
                    href: null,
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.person} title="events/new"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="bill/create-bill"
                options={{
                    href: null,
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.person} title="bill/create-bill"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="bill/pay-bill"
                options={{
                    href: null,
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.person} title="bill/pay-bill"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="my_uni"
                options={{
                    href: null,
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.person} title="my_uni"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="cashstuffing"
                options={{
                    href: null,
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.person} title="cashstuffing"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="futurePredictions"
                options={{
                    href: null,
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.person} title="futurePredictions"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="grants"
                options={{
                    href: null,
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.person} title="grants"/>
                    ),
                }}
            />
            <Tabs.Screen
              name="subscriptions"
                options={{
                    href: null,
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.person} title="subscriptions"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="send"
                options={{
                    href: null,
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.person} title="send"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="request"
                options={{
                    href: null,
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.person} title="request"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    href: null,
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.person} title="notifications"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="transactions"
                options={{
                    href: null,
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.person} title="transactions"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="bill/scan-bill"
                options={{
                    href: null,
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.person} title="bill/scan-bill"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="bill/scan-qr"
                options={{
                    href: null,
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.person} title="bill/scan-qr"/>
                    ),
                }}
            />
            <Tabs.Screen
                name="bill/join-bill"
                options={{
                    href: null,
                    tabBarIcon: ({focused}) => (
                        <TabIcon focused={focused} icon={icons.person} title="bill/join-bill"/>
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
