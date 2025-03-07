import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useGlobalContext } from "@/lib/global-provider";

export default function ScanBillScreen() {
  const { ipAddress, setItemcinja, qrCode } = useGlobalContext();
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  async function takePicture() {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync();
      console.log("Photo taken:", photo.uri);
      await uploadReceipt(photo.uri);
    } catch (error) {
      console.error("Error taking picture:", error);
    }
  }

  async function uploadReceipt(imageUri) {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: "receipt.jpg",
      type: "image/jpeg",
    });
    formData.append("party_id", qrCode.id);


    try {
      const response = await fetch(
        `http://${ipAddress}/api/owents/analyze-receipt/`,
        {
          method: "POST",
          body: formData,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        console.log("Receipt Analysis:", result);

        setItemcinja(result)
        router.replace("/bill/create-bill")

        Alert.alert("Success", "Receipt uploaded successfully!");
      } else {
        const text = await response.text();
        // console.error("Non-JSON response:", text);
        Alert.alert(
          "Error",
          "Failed to upload receipt. Server returned non-JSON response."
        );
      }
    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert("Error", "Failed to upload receipt.");
    }
    // router.replace("/");
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      <TouchableOpacity style={styles.scanButton} onPress={takePicture}>
        <Text style={styles.buttonText}>Scan Bill</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  scanButton: {
    position: "absolute",
    bottom: 90,
    left: "50%",
    transform: [{ translateX: -75 }],
    backgroundColor: "#198cb5",
    padding: 15,
    borderRadius: 10,
    width: 150,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
