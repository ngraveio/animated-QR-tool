import { URDecoder } from "@ngraveio/bc-ur";
import { useRef } from "react";

export const useScanAnimatedQr = ({
  onSuccess,
  onFail,
  onProgress,
  onScan,
}: {
  onSuccess?: (data: string) => void;
  onFail?: (error: string) => void;
  onProgress?: (progress: number) => void;
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

      if (urDecoder.current.isComplete()) {
        const parsed = urDecoder.current.resultUR().decodeCBOR();
        onSuccess?.(JSON.parse(parsed.toString()));
        urDecoder.current = new URDecoder();
      }

      onProgress?.(urDecoder.current.getProgress());
      onScan?.(data);
    } catch (error) {
      onFail?.(error);
      resetDecoder();
    }
  };

  return { onBarCodeScan, resetDecoder };
};
