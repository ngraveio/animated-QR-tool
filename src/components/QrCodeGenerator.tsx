import React, { memo } from "react";
import QRCode, { QRCodeProps } from "react-native-qrcode-svg";
import { useGenerateAnimatedQr } from "@hooks/bcur.hook";

interface Props extends Omit<QRCodeProps, "value"> {
  value: string | null;
  fps?: number;
  fragmentSize?: number;
}

const QRCodeGenerator: React.FC<Props> = ({
  value,
  fps = 8,
  fragmentSize = 90,
  ...props
}) => {
  const frame = useGenerateAnimatedQr(value, { fps, fragmentSize });

  return <QRCode value={frame ?? "NGRAVE"} {...props} />;
};

export default memo(QRCodeGenerator);
