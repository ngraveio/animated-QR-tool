import React, { FC } from "react";
import { Button, StyleSheet, View } from "react-native";
import { RootStackScreenProps } from "../navigators/types";

type Props = RootStackScreenProps<"Home">;

const HomeScreen: FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button title="Scan QR" onPress={() => navigation.navigate("ScanQR")} />
      <Button
        title="Generate QR"
        onPress={() => navigation.navigate("GenerateQR")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
});

export default HomeScreen;
