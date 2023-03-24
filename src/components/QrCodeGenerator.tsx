import React, { memo, useEffect, useReducer } from "react";
import { UR, UREncoder } from "@ngraveio/bc-ur";
import QRCode, { QRCodeProps } from "react-native-qrcode-svg";

interface IState {
  encoder: UREncoder;
  frame: string;
}

const defaultState: IState = {
  encoder: null as any,
  frame: null as any,
};

interface Props extends Omit<QRCodeProps, "value"> {
  value: string | null;
  fps?: number;
  fragmentSize?: number;
  encoderFactory?: (value: any) => UREncoder;
}

const QrCodeGenerator: React.FC<Props> = ({
  value,
  encoderFactory = (value: any, fragmentSize: number) => {
    const ur = UR.fromBuffer(Buffer.from(JSON.stringify(value)));
    return new UREncoder(ur, fragmentSize);
  },
  fps = 8,
  fragmentSize = 90,
  ...props
}) => {
  const [state, dispatch] = useReducer(
    (state: IState, newState: Partial<IState>) => ({ ...state, ...newState }),
    defaultState
  );

  useEffect(() => {
    try {
      if (value) {
        const encoder = encoderFactory(value, fragmentSize);

        dispatch({ encoder, frame: encoder.nextPart().toUpperCase() });
      } else {
        dispatch(defaultState);
      }
    } catch (error) {
      console.warn("🚀 ~ useEffect ~ error", error);
    }
  }, [value, fragmentSize]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (state.encoder)
      timeout = setTimeout(
        () => dispatch({ frame: state.encoder.nextPart().toUpperCase() }),
        1000 / fps
      );
    return () => clearTimeout(timeout);
  }, [state.frame, fps]);

  return <QRCode value={state.frame ?? "NGRAVE"} {...props} />;
};

export default memo(QrCodeGenerator);
