import React, { memo, useEffect } from "react";
import QRCode, { QRCodeProps } from "react-native-qrcode-svg";
import {
  IGenerateAnimatedQrConfig,
  useGenerateAnimatedQr,
} from "@hooks/bcur.hook";
import { Text, View } from "react-native";
import { Ur } from "./../../bcur";

interface Props extends Omit<QRCodeProps, "value"> {
  isActive: boolean;
  payload: Ur<any> | null;
  config: Omit<IGenerateAnimatedQrConfig, "autoStart">;
}

const QRCodeGenerator: React.FC<Props> = ({
  payload,
  config,
  isActive,
  ...props
}) => {
  const { totalFrames, currentFrame, start, stop } = useGenerateAnimatedQr(
    payload,
    config, 
    isActive
  );

  useEffect(() => {
    if (isActive) start();
    else stop();
  }, [isActive]);

  return (
    <View style={{ gap: 10 }}>
      <QRCode value={currentFrame || "NGRAVE"} {...props} />
      <Text>TOTAL FRAMES: {totalFrames}</Text>
    </View>
  );
};

export default memo(QRCodeGenerator);
