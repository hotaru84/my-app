import { useCallback, useMemo, useRef } from "react";

export type Beep = {
  beep: () => void;
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

export const useBeep = (
  hz = 1700,
  length = 0.05,
  rest = 0.025,
): Beep => {
  const audioCtxRef = useRef<AudioContext>();
  const isOpen = useMemo(() => audioCtxRef.current !== undefined, []);

  const open = useCallback(() => {
    if (!isOpen) {
      audioCtxRef.current = new AudioContext();
    }
  }, [isOpen]);
  const close = useCallback(() => {
    if (isOpen) {
      audioCtxRef.current?.close();
      audioCtxRef.current = undefined;
    }
  }, [isOpen]);

  const beep = useCallback(() => {
    const audioCtx = audioCtxRef?.current;
    if (isOpen && audioCtx !== undefined) {
      const n = audioCtx.createOscillator();
      n.type = 'sine';
      n.frequency.setValueAtTime(hz, audioCtx.currentTime);
      n.connect(audioCtx.destination);
      n.start(audioCtx.currentTime + rest);
      n.stop(audioCtx.currentTime + length + rest);
      n.onended = () => {
        n.disconnect();
      };
    }
  }, [hz, isOpen, length, rest]);

  return {
    open,
    close,
    isOpen,
    beep
  }
}