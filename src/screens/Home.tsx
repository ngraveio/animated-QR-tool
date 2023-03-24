import React, { FC } from "react";
import { Button } from "react-native";
import { RootStackScreenProps } from "../navigators/types";

type Props = RootStackScreenProps<"Home">;

const HomeScreen: FC<Props> = ({ navigation }) => {
  return (
    <>
      <Button title="Scan QR" onPress={() => navigation.navigate("ScanQR")} />
      <Button
        title="Generate QR"
        onPress={() => navigation.navigate("GenerateQR")}
      />
    </>
  );
};

export default HomeScreen;
