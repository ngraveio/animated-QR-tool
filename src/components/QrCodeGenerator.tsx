import React, { memo } from "react";
import QRCode, { QRCodeProps } from "react-native-qrcode-svg";
import {
  IGenerateAnimatedQrConfig,
  useGenerateAnimatedQr,
} from "@hooks/bcur.hook";
import { Text, View } from "react-native";

interface Props extends Omit<QRCodeProps, "value"> {
  payload: string | null;
  config: IGenerateAnimatedQrConfig;
}

const QRCodeGenerator: React.FC<Props> = ({ payload, config, ...props }) => {
  const { currentFrame: frame, totalFrames } = useGenerateAnimatedQr(
    payload,
    config
  );

  return (
    <View style={{ gap: 10 }}>
      <QRCode value={frame ?? "NGRAVE"} {...props} />
      <Text>TOTAL FRAMES: {totalFrames}</Text>
    </View>
  );
};

export default memo(QRCodeGenerator);
