import React, { FC, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  BackHandler,
  Text,
  Button,
} from "react-native";
import QRCodeScanner from "@components/QRCodeScanner";
import { useScanAnimatedQr } from "../hooks/bcur.hook";
import { RootStackScreenProps } from "../navigators/types";

type Props = RootStackScreenProps<"ScanQR">;

const ScanQRScreen: FC<Props> = () => {
  const [data, setData] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const refs = useRef<{ timeout: NodeJS.Timeout }>({ timeout: null }).current;
  const [option, setOption] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const { onBarCodeScan, resetDecoder, urDecoder } = useScanAnimatedQr({
    onSuccess: () => {
      setIsCompleted(true);
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

  useEffect(() => {
    if (!isCompleted) return setData("");
    switch (option) {
      case 0:
        return setData(urDecoder.current.resultUR().cbor.toString());
      case 1:
        return setData(urDecoder.current.resultUR().decodeCBOR().toString());
      case 2:
        return setData(
          JSON.parse(urDecoder.current.resultUR().decodeCBOR().toString())
        );
      default:
        return setData("");
    }
  }, [option, isCompleted]);

  const reset = () => {
    setIsCompleted(false);
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
        visible={isCompleted}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={reset}
      >
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View>
            <Button
              color={option === 0 && "green"}
              title="undecoded cbor"
              onPress={() => setOption(0)}
            />
            <Button
              color={option === 1 && "green"}
              title="decoded cbor"
              onPress={() => setOption(1)}
            />
            <Button
              color={option === 2 && "green"}
              title="decoded and json parsed cbor"
              onPress={() => setOption(2)}
            />
          </View>
          <Text selectable style={styles.input}>
            {data}
          </Text>
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
    flex: 1,
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
