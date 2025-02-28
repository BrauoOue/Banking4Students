import { Text, View } from "react-native";
import {Link} from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        <Text classNam="font-bold text-lg my-10">Welcome to Banking4Students</Text>
      <Link href="/home">Homes</Link>
      <Link href="/profile">Profile</Link>
      <Link href="/sign-in">Sign In</Link>
      <Link href="/properties/1">Properties</Link>
    </View>
  );
}
