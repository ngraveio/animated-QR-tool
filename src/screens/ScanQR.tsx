import React, { FC, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  BackHandler,
  Text,
  Button,
  ScrollView,
} from "react-native";
import QRCodeScanner from "@components/QRCodeScanner";
import { useScanAnimatedQr } from "../hooks/bcur.hook";
import { RootStackScreenProps } from "../navigators/types";
import pako from "pako";

type Props = RootStackScreenProps<"ScanQR">;

const ScanQRScreen: FC<Props> = () => {
  const [data, setData] = useState<{ tag: number; type: string; data: any }>(
    undefined
  );
  const [showProgress, setShowProgress] = useState(false);
  const refs = useRef<{ timeout: NodeJS.Timeout }>({ timeout: null }).current;
  const [option, setOption] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const { onBarCodeScan, resetDecoder, urDecoder } = useScanAnimatedQr({
    onSuccess: () => {
      setIsCompleted(true);
    },
    onFail: (error) => {
      setData({ tag: 666, type: "error", data: "ERROR: " + error });
    },
    onScan: () => {
      clearTimeout(refs.timeout);
      setShowProgress(true);
      refs.timeout = setTimeout(() => setShowProgress(false), 200);
    },
  });

  useEffect(() => {
    if (!isCompleted) return setData(undefined);
    try {
      const registryItem = urDecoder.current.resultRegistryType();
      console.log("registryItem", registryItem);
      console.log("tag", registryItem.getRegistryType().getTag());
      console.log("type", registryItem.getRegistryType().getType());
      console.log("dataItem", registryItem.toDataItem());
      console.log("cbor", registryItem.toCBOR());
      console.log("data", registryItem.toDataItem().getData());
      return setData({
        tag: registryItem.getRegistryType().getTag(),
        type: registryItem.getRegistryType().getType(),
        data: JSON.stringify(registryItem.toDataItem(), null, 2),
      });
    } catch (error) {
      alert(error);
    }
  }, [option, isCompleted]);

  const reset = () => {
    setIsCompleted(false);
    resetDecoder();
    return true;
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      reset
    );
    return () => subscription.remove();
  }, []);

  const onCloseModal = () => {
    reset();
  };

  return (
    <View style={styles.container}>
      {!isCompleted && (
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
            <Button color="red" onPress={onCloseModal} title="close" />
            {/* <Button
              color={option === 0 && "green"}
              title="decoded cbor"
              onPress={() => setOption(0)}
            />
            <Button
              color={option === 1 && "green"}
              title="decoded cbor & unzipped"
              onPress={() => setOption(1)}
            /> */}
          </View>
          <ScrollView bounces={false}>
            {data ? (
              <>
                <Text style={styles.input}>Type: {data.type}</Text>
                <Text style={styles.input}>Tag: {data.tag}</Text>
                <Text selectable style={styles.data}>
                  {data.data}
                </Text>
              </>
            ) : (
              <></>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  data: {
    color: "black",
    margin: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    flex: 1,
  },
  input: {
    color: "black",
    fontWeight: "bold",
    margin: 5,
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
