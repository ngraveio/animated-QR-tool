import React, { FC, useEffect, useReducer, useRef, useState } from "react";
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
import { SCREEN_WIDTH } from "../constants";
import QRCodeGenerator from "@components/QRCodeGenerator";
import Counter from "@components/Counter";
import { UREncoder } from "@ngraveio/bc-ur";
import {
  CryptoOutput,
  CryptoECKey,
  ScriptExpressions,
  RegistryItem,
  CryptoHDKey,
  CryptoKeypath,
  PathComponent,
  CryptoMultiAccounts,
  CryptoAccount
} from "@keystonehq/bc-ur-registry";
import { FlatList } from "react-native-gesture-handler";

export function createCryptoOutput(
  key = "02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5"
): RegistryItem {
  const scriptExpressions = [ScriptExpressions.PUBLIC_KEY_HASH];
  const ecKey = new CryptoECKey({
    data: Buffer.from(key, "hex"),
    curve: 1,
  });

  const cryptoOutput = new CryptoOutput(scriptExpressions, ecKey);
  return cryptoOutput;
}

export function createCryptoHdKey(): RegistryItem {
  const originKeypath = new CryptoKeypath(
    [
      new PathComponent({ index: 44, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
      new PathComponent({ index: 0, hardened: true }),
    ],
    Buffer.from("d34db33f", "hex")
  );
  const childrenKeypath = new CryptoKeypath([
    new PathComponent({ index: 1, hardened: false }),
    new PathComponent({ hardened: false }),
  ]);
  const hdkey = new CryptoHDKey({
    isMaster: false,
    key: Buffer.from(
      "02d2b36900396c9282fa14628566582f206a5dd0bcc8d5e892611806cafb0301f0",
      "hex"
    ),
    chainCode: Buffer.from(
      "637807030d55d01f9a0cb3a7839515d796bd07706386a6eddf06cc29a65a0e29",
      "hex"
    ),
    origin: originKeypath,
    children: childrenKeypath,
    parentFingerprint: Buffer.from("78412e3a", "hex"),
  });
  return hdkey;
}

export function createCryptoMultiAccount(): RegistryItem {
  const originKeyPath = new CryptoKeypath([
    new PathComponent({ index: 44, hardened: true }),
    new PathComponent({ index: 501, hardened: true }),
    new PathComponent({ index: 0, hardened: true }),
    new PathComponent({ index: 0, hardened: true }),
  ]);

  const cryptoHDKey = new CryptoHDKey({
    isMaster: false,
    key: Buffer.from(
      "02eae4b876a8696134b868f88cc2f51f715f2dbedb7446b8e6edf3d4541c4eb67b",
      "hex"
    ),
    origin: originKeyPath,
  });

  const multiAccounts = new CryptoMultiAccounts(
    Buffer.from("e9181cf3", "hex"),
    [cryptoHDKey],
    "keystone"
  );
  return multiAccounts;
}

export function createCryptoAccount(): RegistryItem {
  const masterFingerprint = Buffer.from("37b5eed4", "hex");
  const parentFingerprint = Buffer.from("37b5eed4", "hex");
  const key = Buffer.from(
    '0260563ee80c26844621b06b74070baf0e23fb76ce439d0237e87502ebbd3ca346',
    'hex',
  );
  const chainCode = Buffer.from(
    '2fa0e41c9dc43dc4518659bfcef935ba8101b57dbc0812805dd983bc1d34b813',
    'hex',
  );

  const cryptoAccount = new CryptoAccount(Buffer.from("37b5eed4", "hex"), [
    new CryptoOutput(
      [ScriptExpressions.WITNESS_SCRIPT_HASH],
      new CryptoHDKey({
        isMaster: false,
        key,
        chainCode: chainCode,
        origin: new CryptoKeypath(
          [
            new PathComponent({ index: 48, hardened: true }),
            new PathComponent({ index: 0, hardened: true }),
            new PathComponent({ index: 0, hardened: true }),
            new PathComponent({ index: 2, hardened: true }),
          ],
          masterFingerprint,
        ),
        parentFingerprint,
      }),
    ),
  ]);
  return cryptoAccount;
}
const buttons = [
  { title: "CryptoOutput", registryItem: createCryptoOutput() },
  { title: "CryptoHdKey", registryItem: createCryptoHdKey() },
  { title: "CryptoAccount", registryItem: createCryptoAccount() },
];
type Props = RootStackScreenProps<"GenerateQR">;

const GenerateQRScreen: FC<Props> = () => {
  const [payloadModalVisible, setPayloadModalVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [payload, setPayload] = useState<string | null>(null);
  const refs = useRef({ pendingPayload: "" }).current;
  const [fps, setFps] = useState(8);
  const [fragmentSize, setFragmentSize] = useState(90);

  const [encoderFactory, setEncoderFactory] = useReducer(
    (_, newState: RegistryItem) =>
      newState.toUREncoder() as unknown as UREncoder,
    null
  );

  const startDemo = (data: RegistryItem) => {
    setEncoderFactory(data);
    setPayload(JSON.stringify(data));
    setIsActive(true);
  };

  const reset = () => {
      setPayload(null);
      setIsActive(false);
  }

  return (
    <>
      <View style={styles.container}>
        <KeyboardAvoidingView keyboardVerticalOffset={100}>
          <ScrollView style={styles.scroll}>
            <FlatList
              data={buttons}
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
                size={Platform.OS === "web" ? 600 : SCREEN_WIDTH - 40}
              />
            </View>
            <View style={{ gap: 10 }}>
              <Button
                title={"Reset"}
                onPress={reset}
              ></Button>
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
    // flexDirection: "row",
    // flexWrap: "wrap",
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
    minWidth: 300,
  },
});

export default GenerateQRScreen;
