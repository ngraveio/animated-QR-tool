import React, { useState, useEffect, FC, memo } from "react";
import { Text } from "react-native";
import { BarCodeScanner, BarCodeScannerProps } from "expo-barcode-scanner";

type Props = Pick<BarCodeScannerProps, "style" | "onBarCodeScanned">;

const QRCodeScanner: FC<Props> = ({ style, onBarCodeScanned }) => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <BarCodeScanner
      onBarCodeScanned={onBarCodeScanned}
      barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
      style={style}
    />
  );
};

export default memo(QRCodeScanner);
