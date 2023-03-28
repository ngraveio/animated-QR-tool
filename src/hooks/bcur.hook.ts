import { UR, URDecoder, UREncoder } from "@ngraveio/bc-ur";
import { useEffect, useReducer, useRef } from "react";

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

interface IGenerateAnimatedQrState {
  encoder: UREncoder;
  frame: string;
}

const generateAnimatedQrDefaultState: IGenerateAnimatedQrState = {
  encoder: null,
  frame: null,
};

export interface IGenerateAnimatedQrConfig {
  fps?: number;
  fragmentSize?: number;
  isActive?: boolean;
  encoderFactory?: (
    payload: string,
    config: Pick<IGenerateAnimatedQrConfig, "fragmentSize">
  ) => UREncoder;
}

const defaultEncoderFactory: IGenerateAnimatedQrConfig["encoderFactory"] = (
  payload,
  { fragmentSize }
) => {
  const ur = UR.fromBuffer(Buffer.from(JSON.stringify(payload)));
  return new UREncoder(ur, fragmentSize);
};

/**
 * Generates an animated QR code
 * @param payload - the data to be encoded
 * @param config.fps - the number of frames per second
 * @param config.fragmentSize - the size of each fragment of the animated QR
 * @param config.isActive - if false, the animation will be paused, if true, it will resume
 * @param config.encoderFactory is a function that returns an instance of UREncoder. **It should be memoized**
 * @returns
 */
export const useGenerateAnimatedQr = (
  payload: string,
  {
    isActive = true,
    fps = 8,
    fragmentSize = 90,
    encoderFactory = defaultEncoderFactory,
  }: IGenerateAnimatedQrConfig = {}
) => {
  const refs = useRef<{ timeout: NodeJS.Timeout }>({
    timeout: null,
  }).current;
  const [state, dispatch] = useReducer(
    (
      state: IGenerateAnimatedQrState,
      newState: Partial<IGenerateAnimatedQrState>
    ) => ({ ...state, ...newState }),
    generateAnimatedQrDefaultState
  );

  useEffect(() => {
    try {
      if (payload) {
        const encoder = encoderFactory(payload, { fragmentSize });
        dispatch({ encoder, frame: encoder.nextPart().toUpperCase() });
      } else dispatch(generateAnimatedQrDefaultState);
    } catch (error) {
      console.warn("🚀 ~ useEffect ~ error", error);
    }
  }, [payload, fragmentSize, encoderFactory]);

  useEffect(() => {
    clearTimeout(refs.timeout);
    if (state.encoder && isActive) {
      dispatch({ frame: state.encoder.nextPart().toUpperCase() });
    }
  }, [state.encoder, isActive, fps]);

  useEffect(() => {
    if (state.encoder)
      refs.timeout = setTimeout(
        () => dispatch({ frame: state.encoder.nextPart().toUpperCase() }),
        1000 / fps
      );
    return () => clearTimeout(refs.timeout);
  }, [state.frame]);

  return {
    currentFrame: state.frame,
    totalFrames: state.encoder?.fragments.length,
  };
};
