import React, { FC, useReducer, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Button,
  Modal,
  TextInput,
  SafeAreaView,
  Text,
  Platform,
  Pressable,
} from "react-native";
import { RootStackScreenProps } from "@navigators/types";
import KeyboardAvoidingView from "@components/KeyboardAvoidingView";
import { SCREEN_HEIGHT } from "../constants";
import QRCodeGenerator from "@components/QRCodeGenerator";
import Counter from "@components/Counter";
import { UREncoder } from "@ngraveio/bc-ur";
import { RegistryItem } from "@keystonehq/bc-ur-registry";
import { FlatList } from "react-native-gesture-handler";
import {
  createCryptoOutput,
  createCryptoHdKey,
  createCryptoAccount,
} from "../keystone";
import { defaultEncoderFactory } from "@hooks/bcur.hook";

type Props = RootStackScreenProps<"GenerateQR">;

const GenerateQRScreen: FC<Props> = () => {
  const [payloadModalVisible, setPayloadModalVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [payload, setPayload] = useState<string | null>(null);
  const refs = useRef({ pendingPayload: "" }).current;
  const [fps, setFps] = useState(8);
  const [fragmentSize, setFragmentSize] = useState(90);

  const [encoderFactory, setEncoderFactory] = useReducer(
    (_, newState: RegistryItem | string) => {
      if (typeof newState === "string") {
        return defaultEncoderFactory(newState || "empty", { fragmentSize });
      }
      return newState.toUREncoder() as unknown as UREncoder;
    },
    defaultEncoderFactory(payload || "empty", { fragmentSize })
  );

  const startDemo = (data: RegistryItem) => {
    setEncoderFactory(data);
    setPayload(JSON.stringify(data));
    setIsActive(true);
  };

  const reset = () => {
    setPayload(null);
    setIsActive(false);
  };

  const getQRSize = () => {
    if (Platform.OS === "web") {
      return (SCREEN_HEIGHT - 80) * 0.8;
    } else {
      return SCREEN_HEIGHT - 40;
    }
  };

  const buttons = [
    { title: "CryptoOutput", registryItem: createCryptoOutput() },
    { title: "CryptoHdKey", registryItem: createCryptoHdKey() },
    { title: "CryptoAccount", registryItem: createCryptoAccount() },
    // not supported by the keystone decoder
    // { title: "CryptoMultiAccount", registryItem: createCryptoMultiAccount() },
  ];

  return (
    <>
      <View style={styles.container}>
        <KeyboardAvoidingView keyboardVerticalOffset={100}>
          <ScrollView style={styles.scroll}>
            <FlatList
              data={buttons}
              horizontal={false}
              numColumns={2}
              contentContainerStyle={styles.buttonContainer}
              renderItem={(button) => (
                <Pressable
                  onPress={() => startDemo(button.item.registryItem)}
                  style={styles.button}
                >
                  <Text>{button.item.title}</Text>
                </Pressable>
              )}
            ></FlatList>
            <View style={styles.qrContainer}>
              <QRCodeGenerator
                payload={payload}
                isActive={isActive}
                config={{
                  fps,
                  fragmentSize,
                  encoderFactory: () => encoderFactory,
                }}
                size={getQRSize()}
              />
            </View>
            <View style={{ gap: 10 }}>
              <Button title={"Reset"} onPress={reset}></Button>
              <Button
                title="Enter Payload"
                onPress={() => setPayloadModalVisible(true)}
              />
              <Button
                title={isActive ? "Stop" : "Start"}
                onPress={() => {
                  setIsActive((prev) => !prev);
                }}
              />
              <View>
                <Text>FPS</Text>
                <Counter min={1} max={60} onChange={setFps} value={fps} />
              </View>
              <View>
                <Text>FRAGMENT SIZE</Text>
                <Counter
                  min={1}
                  max={2000}
                  onChange={setFragmentSize}
                  value={fragmentSize}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <Modal
        visible={payloadModalVisible}
        presentationStyle="formSheet"
        animationType="slide"
        onRequestClose={() => setPayloadModalVisible(false)}
      >
        <KeyboardAvoidingView>
          <SafeAreaView style={styles.modalContainer}>
            <TextInput
              multiline
              textAlignVertical="top"
              style={styles.input}
              onChangeText={(text) => {
                refs.pendingPayload = text;
              }}
            />
            <Button
              title="Enter"
              onPress={() => {
                setPayload(refs.pendingPayload);
                setEncoderFactory(refs.pendingPayload);
                setPayloadModalVisible(false);
              }}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    margin: 20,
  },
  qrContainer: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 40,
  },
  buttonContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    padding: 16,
    backgroundColor: "orange",
    borderRadius: 8,
  },
});

export default GenerateQRScreen;
