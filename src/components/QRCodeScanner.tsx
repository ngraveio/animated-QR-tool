import React, { useState, useEffect, FC, memo } from "react";
import { Text } from "react-native";
import { BarCodeScanner, BarCodeScannerProps } from "expo-barcode-scanner";
import { Camera } from "expo-camera";

type Props = Pick<BarCodeScannerProps, "style" | "onBarCodeScanned">;

const QRCodeScanner: FC<Props> = ({ style, onBarCodeScanned }) => {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    requestPermission();
  }, []);

  if (!permission) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (!permission.granted) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Camera
      onBarCodeScanned={onBarCodeScanned}
      barCodeScannerSettings={{
        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
      }}
      style={style}
    />
  );
};

export default memo(QRCodeScanner);
