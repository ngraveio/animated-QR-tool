import "./scripts/import-buffer";
import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./src/navigators/RootStack";
import { Logs } from "expo";

Logs.enableExpoCliLogging();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </>
  );
}
