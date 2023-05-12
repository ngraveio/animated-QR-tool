import React, { memo, useEffect } from "react";
import QRCode, { QRCodeProps } from "react-native-qrcode-svg";
import {
  IGenerateAnimatedQrConfig,
  useGenerateAnimatedQr,
} from "@hooks/bcur.hook";
import { Text, View } from "react-native";
import { UREncoder } from "@ngraveio/bc-ur";

interface Props extends Omit<QRCodeProps, "value"> {
  isActive: boolean;
  encoder: UREncoder;
  config: Omit<IGenerateAnimatedQrConfig, "autoStart">;
}

const QRCodeGenerator: React.FC<Props> = ({
  encoder,
  config,
  isActive,
  ...props
}) => {
  const { totalFrames, currentFrame, start, stop } = useGenerateAnimatedQr(encoder,
    config,
    isActive
  );

  useEffect(() => {
    if (isActive) start();
    else stop();
  }, [isActive]);

  return (
    <View style={{ gap: 10, justifyContent:"center", alignItems:"center" }}>
      <QRCode value={currentFrame || "NGRAVE"} {...props} />
      <Text>{currentFrame}</Text>
      <Text>TOTAL FRAMES: {totalFrames}</Text>
    </View>
  );
};

export default memo(QRCodeGenerator);
