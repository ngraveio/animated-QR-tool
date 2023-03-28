import { UR, URDecoder, UREncoder } from "@ngraveio/bc-ur";
import { useCallback, useEffect, useRef, useState } from "react";

export const useScanAnimatedQr = ({
  onSuccess,
  onFail,
  onScan,
}: {
  onSuccess?: (data: string) => void;
  onFail?: (error: string) => void;
  onScan?: (data: string) => void;
} = {}) => {
  const urDecoder = useRef(new URDecoder());

  const resetDecoder = () => {
    urDecoder.current = new URDecoder();
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
    payload: string,
    config: Pick<IGenerateAnimatedQrConfig, "fragmentSize">
  ) => UREncoder;
}

const defaultEncoderFactory: IGenerateAnimatedQrConfig["encoderFactory"] = (
  payload,
  { fragmentSize }
) => {
  const ur = UR.fromBuffer(Buffer.from(payload));
  return new UREncoder(ur, fragmentSize);
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
  payload: string,
  {
    fps = 8,
    fragmentSize = 90,
    autoStart = false,
    encoderFactory = defaultEncoderFactory,
  }: IGenerateAnimatedQrConfig = {}
) => {
  const timeout = useRef<NodeJS.Timeout>(null);
  const encoder = useRef<UREncoder>(null);
  const [frame, setFrame] = useState<string>(null);

  const hasEncoder = useCallback(() => !!encoder.current, []);

  const getNextFrame = useCallback(() => {
    if (!hasEncoder()) return null;
    return encoder.current.nextPart().toUpperCase();
  }, []);

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
  }, [payload, fragmentSize, encoderFactory]);

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
    totalFrames: encoder.current?.fragments.length,
    start,
    stop,
  };
};
