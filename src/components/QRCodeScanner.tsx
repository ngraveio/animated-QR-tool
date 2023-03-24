import React, { useState, useEffect, FC, memo } from 'react';
import { Text } from 'react-native';
import { BarCodeScanner as RNBarCodeScanner, BarCodeScannerProps } from 'expo-barcode-scanner';

type Props = Pick<BarCodeScannerProps, "style" | "onBarCodeScanned">

const BarCodeScanner: FC<Props> = ({style, onBarCodeScanned}) => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await RNBarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
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
      <RNBarCodeScanner
        onBarCodeScanned={onBarCodeScanned}
        barCodeTypes={[RNBarCodeScanner.Constants.BarCodeType.qr]}
        style={style}
      />
  );
}

export default memo(BarCodeScanner)