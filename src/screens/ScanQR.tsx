import React, { FC, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  BackHandler,
  Platform,
  Text,
} from "react-native";
import QRCodeScanner from "@components/QRCodeScanner";
import KeyboardAvoidingView from "@components/KeyboardAvoidingView";
import { useScanAnimatedQr } from "../hooks/bcur.hook";
import { RootStackScreenProps } from "../navigators/types";

type Props = RootStackScreenProps<"ScanQR">;

const ScanQRScreen: FC<Props> = () => {
  const [data, setData] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const refs = useRef<{ timeout: NodeJS.Timeout }>({ timeout: null }).current;

  const { onBarCodeScan, resetDecoder } = useScanAnimatedQr({
    onSuccess: (data) => {
      setData(data);
    },
    onFail: (error) => {
      setData("ERROR: " + error);
    },
    onScan: () => {
      clearTimeout(refs.timeout);
      setShowProgress(true);
      refs.timeout = setTimeout(() => setShowProgress(false), 200);
    },
  });

  const reset = () => {
    setData("");
    return true;
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      reset
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!data) {
      resetDecoder();
      const timeout = setTimeout(() => {
        setVisible(false);
      }, 600);
      return () => clearTimeout(timeout);
    } else setVisible(true);
  }, [data]);

  return (
    <View style={styles.container}>
      {!visible && (
        <QRCodeScanner
          onBarCodeScanned={({ data }) => onBarCodeScan(data)}
          style={styles.scanner}
        />
      )}
      {showProgress && <Text style={styles.progress}>Scanning...</Text>}
      <Modal
        visible={!!data}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={reset}
      >
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <KeyboardAvoidingView>
            <TextInput
              multiline
              value={data}
              onChangeText={setData}
              style={styles.input}
            />
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    color: "black",
    margin: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
  },
  scanner: {
    height: "100%",
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  progress: {
    position: "absolute",
    alignSelf: "center",
    bottom: 40,
    fontSize: 30,
    color: "white",
  },
});

export default ScanQRScreen;
