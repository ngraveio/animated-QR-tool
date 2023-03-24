import React, { memo } from "react";
import QRCode, { QRCodeProps } from "react-native-qrcode-svg";
import {
  IGenerateAnimatedQrConfig,
  useGenerateAnimatedQr,
} from "@hooks/bcur.hook";

interface Props extends Omit<QRCodeProps, "value"> {
  payload: string | null;
  config: IGenerateAnimatedQrConfig;
}

const QRCodeGenerator: React.FC<Props> = ({ payload, config, ...props }) => {
  const frame = useGenerateAnimatedQr(payload, config);

  return <QRCode value={frame ?? "NGRAVE"} {...props} />;
};

export default memo(QRCodeGenerator);
