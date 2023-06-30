import { UR, URDecoder, UREncoder } from "@ngraveio/bc-ur";
import { useCallback, useEffect, useRef, useState } from "react";
// import { URRegistryDecoder } from '@keystonehq/ur-decoder';
import { URRegistryDecoder } from "../ngrave";

export const useScanAnimatedQr = ({
  onSuccess,
  onFail,
  onScan,
}: {
  onSuccess?: (data: string) => void;
  onFail?: (error: string) => void;
  onScan?: (data: string) => void;
} = {}) => {
  // const urDecoder = useRef(new URDecoder());
  const urDecoder = useRef(new URRegistryDecoder());

  const resetDecoder = () => {
    urDecoder.current = new URRegistryDecoder();
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
}

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
  encoder: UREncoder,
  {
    fps = 8,
    fragmentSize = 90,
    autoStart = false,
  }: IGenerateAnimatedQrConfig = {},
  isActive: boolean
) => {
  const timeout = useRef<NodeJS.Timeout>(null);
  const encoderRef = useRef<UREncoder>(null);
  const [frame, setFrame] = useState<string>(null);

  const hasEncoder = useCallback(() => !!encoderRef.current, []);

  const getNextFrame = useCallback(() => {
    if (!hasEncoder()) return null;
    return encoderRef.current.nextPart().toUpperCase();
  }, []);

  useEffect(() => {
    stop();
    try {
      if (encoder) {
        encoderRef.current = encoder;
        autoStart && start();
      } else {
        encoderRef.current = null;
        setFrame(null);
      }
    } catch (error) {
      console.warn("🚀 ~ useEffect ~ error", error);
    }
  }, [isActive, fragmentSize, encoder]);

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
    totalFrames: encoderRef.current?.fragments.length,
    start,
    stop,
  };
};
