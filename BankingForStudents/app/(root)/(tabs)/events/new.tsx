import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const NewEvent = () => {
    const router = useRouter();
    const [eventName, setEventName] = useState("");

    const handleCreateEvent = () => {
        if (!eventName.trim()) return;
        // todo zapisi v baza i route to /events/[id]
        const newEventId = Math.floor(Math.random() * 1000).toString();

        router.push(`/events/${newEventId}`);
    };

    return (
        <View className="flex-1 bg-white px-4 pt-10">
            {/* Header */}
            <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-accent mb-4">← Back</Text>
            </TouchableOpacity>

            <Text className="text-2xl font-bold mb-4">Create New Event</Text>

            {/* Event Name Input */}
            <Text className="text-sm mb-1">Event Name:</Text>
            <TextInput
                className="border border-gray-300 p-2 rounded mb-4"
                placeholder="Enter event name"
                value={eventName}
                onChangeText={setEventName}
            />

            {/* Create Event Button */}
            <TouchableOpacity
                className="bg-blue-500 p-3 rounded"
                onPress={handleCreateEvent}
            >
                <Text className="text-white text-center font-bold">Create Event</Text>
            </TouchableOpacity>
        </View>
    );
};

export default NewEvent;
