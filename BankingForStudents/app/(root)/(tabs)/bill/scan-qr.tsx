import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {useRouter} from "expo-router";

export default function ScanQRCodeScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [qrData, setQrData] = useState(null);
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.scanButton}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      setQrData(data);
      console.log(" Scanned QR Code: ", data)
      router.replace("/bill/join-bill/" + data.split("/")[6])
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      {/* Show Scanned QR Data */}
      {qrData && (
        <View style={styles.qrDataContainer}>
          <Text style={styles.qrText}>Scanned Data: {qrData}</Text>
        </View>
      )}

      {/* Scan Again Button */}
      {scanned && (
        <TouchableOpacity style={styles.scanButton} onPress={() => setScanned(false)}>
          <Text style={styles.buttonText}>Scan Again</Text>
        </TouchableOpacity>
      )}
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
  qrDataContainer: {
    position: "absolute",
    bottom: 150,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 10,
    borderRadius: 10,
  },
  qrText: {
    color: "white",
    fontSize: 16,
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
