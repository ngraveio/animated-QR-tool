// import { UR, URDecoder, UREncoder } from "@ngraveio/bc-ur";
import {
  NgraveTranscoder,
  Ur,
  UrFountainEncoder,
} from "./../../bcur";
import { useCallback, useEffect, useRef, useState } from "react";

const {
  fountainEncoderCreator,
  fountainDecoderCreator,
} = new NgraveTranscoder();
export const useScanAnimatedQr = ({
  onSuccess,
  onFail,
  onScan,
}: {
  onSuccess?: (data: string) => void;
  onFail?: (error: string) => void;
  onScan?: (data: string) => void;
} = {}) => {
  const urDecoder = useRef(fountainDecoderCreator());

  const resetDecoder = () => {
    urDecoder.current = fountainDecoderCreator();
  };

  const onBarCodeScan = (data: string) => {
    if (!data) return;
    try {
      urDecoder.current.receivePart(data);

      if (urDecoder.current.isComplete()) onSuccess?.(data);

      onScan?.(data);
    } catch (error) {
      onFail?.(error);
      resetDecoder();
    }
  };

  return { onBarCodeScan, resetDecoder, urDecoder };
};

export interface IGenerateAnimatedQrConfig {
  fps?: number;
  fragmentSize?: number;
  autoStart?: boolean;
  encoderFactory?: (
    payload: Ur<any>,
    config: Pick<IGenerateAnimatedQrConfig, "fragmentSize">
  ) => UrFountainEncoder<any>;
}

const defaultEncoderFactory: IGenerateAnimatedQrConfig["encoderFactory"] = (
  payload,
  { fragmentSize }
) => {
  return fountainEncoderCreator(payload, fragmentSize);
};

/**
 * Generates an animated QR code
 * @param payload - the data to be encoded
 * @param config.fps - the number of frames per second
 * @param config.fragmentSize - the size of each fragment of the animated QR
 * @param config.autoStart - whether to start the animation automatically
 * @param config.encoderFactory is a function that returns an instance of UREncoder. **It should be memoized**
 * @returns
 */
export const useGenerateAnimatedQr = (
  payload: Ur<any>,
  {
    fps = 8,
    fragmentSize = 90,
    autoStart = false,
    encoderFactory = defaultEncoderFactory,
  }: IGenerateAnimatedQrConfig = {}, isActive
) => {
  const timeout = useRef<NodeJS.Timeout>(null);
  const encoder = useRef<UrFountainEncoder<any>>(null);
  const [frame, setFrame] = useState<string>(null);

  const hasEncoder = useCallback(() => !!encoder.current, []);

  const getNextFrame = useCallback(() => {
    if (!hasEncoder()) {
      return null;
    }
    return encoder.current.nextPart().toUpperCase();
  }, [payload]);

  useEffect(() => {
    stop();
    try {
      if (payload && fragmentSize && encoderFactory) {
        encoder.current = encoderFactory(payload, { fragmentSize });
        autoStart && start();
      } else {
        encoder.current = null;
        setFrame(null);
      }
    } catch (error) {
      console.warn("🚀 ~ useEffect ~ error", error);
    }
  }, [isActive, payload, fragmentSize, encoderFactory]);

  const start = useCallback(() => {
    setFrame(getNextFrame());
  }, []);

  const stop = useCallback(() => {
    if (!timeout.current) return;
    clearInterval(timeout.current);
    timeout.current = null;
  }, []);

  useEffect(() => {
    if (hasEncoder())
      timeout.current = setTimeout(() => setFrame(getNextFrame()), 1000 / fps);
    return () => stop();
  }, [frame]);

  useEffect(() => {
    stop();
    start();
  }, [fps]);

  return {
    currentFrame: frame,
    totalFrames: encoder.current?.getPureFragmentCount(),
    start,
    stop,
  };
};
