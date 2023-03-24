import React, { FC, useCallback, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Button,
  Modal,
  TextInput,
  SafeAreaView,
  Text,
} from "react-native";
import { RootStackScreenProps } from "@navigators/types";
import KeyboardAvoidingView from "@components/KeyboardAvoidingView";
import { SCREEN_WIDTH } from "../constants";
import QRCodeGenerator from "@components/QRCodeGenerator";
import Counter from "@components/Counter";

type Props = RootStackScreenProps<"GenerateQR">;

const GenerateQRScreen: FC<Props> = () => {
  const [payloadModalVisible, setPayloadModalVisible] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [payload, setPayload] = useState<string | null>(null);
  const refs = useRef({ pendingPayload: "" }).current;
  const [fps, setFps] = useState(8);

  return (
    <>
      <View style={styles.container}>
        <ScrollView style={styles.scroll}>
          <View style={styles.qrContainer}>
            <QRCodeGenerator
              payload={payload}
              config={{ fps, fragmentSize: 90, isActive }}
              size={SCREEN_WIDTH - 40}
            />
          </View>
          <View style={{ gap: 10 }}>
            <Button
              title="Enter Payload"
              onPress={() => setPayloadModalVisible(true)}
            />
            <Button title="Reset" onPress={() => setPayload(null)} />
            <Button
              title={isActive ? "Pause" : "Resume"}
              onPress={() => setIsActive((prev) => !prev)}
            />
            <View>
              <Text>FPS</Text>
              <Counter min={1} max={30} onChange={setFps} value={fps} />
            </View>
          </View>
        </ScrollView>
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
