import React, { FC, useEffect, useRef, useState } from "react";
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
} from "react-native";
import { RootStackScreenProps } from "@navigators/types";
import KeyboardAvoidingView from "@components/KeyboardAvoidingView";
import { SCREEN_WIDTH } from "../constants";
import QRCodeGenerator from "@components/QRCodeGenerator";
import Counter from "@components/Counter";
import { Ur } from "./../../bcur";

type Props = RootStackScreenProps<"GenerateQR">;

const GenerateQRScreen: FC<Props> = () => {
  const [payloadModalVisible, setPayloadModalVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [payload, setPayload] = useState<Ur<any> | null>(null);
  const refs = useRef({ pendingPayload: "" }).current;
  const [fps, setFps] = useState(8);
  const [fragmentSize, setFragmentSize] = useState(90);

  // set intial payload
  useEffect(() => {
    const hardCodedPayload = "Pieter";
    const ur = Ur.toUr(hardCodedPayload, { type: "bytes" });
    setPayload(payload ?? ur);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <KeyboardAvoidingView keyboardVerticalOffset={100}>
          <ScrollView style={styles.scroll}>
            <View style={styles.qrContainer}>
              <QRCodeGenerator
                payload={payload}
                isActive={isActive}
                config={{ fps, fragmentSize }}
                size={Platform.OS === "web" ? 600 : SCREEN_WIDTH - 40}
              />
            </View>
            <View style={{ gap: 10 }}>
              <Button title={"Reset"} onPress={() => {setPayload(null); setIsActive(false)}} />
              <Button
                title="Enter Payload"
                onPress={() => setPayloadModalVisible(true)}
              />
              <Button
                title={isActive ? "Stop" : "Start"}
                onPress={() => {setIsActive((prev) => !prev)}}
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
                setPayload(Ur.toUr(refs.pendingPayload, {type: "bytes"}));
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
});

export default GenerateQRScreen;
