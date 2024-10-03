import { useCallback, useEffect, useMemo, useRef } from "react";

type Beep = {
  beep: () => void;
}

export const useBeep = (
  hz = 1700,
  length = 0.05,
  rest = 0.025,
): Beep => {
  const audioCtxRef = useRef<AudioContext>();

  const on = () => {
    audioCtxRef.current = new AudioContext();
  };
  const off = () => {
    audioCtxRef.current?.close();
    audioCtxRef.current = undefined;
  };
  useEffect(() => {
    on();
    return off;
  });

  const beep = useCallback(() => {
    if (!audioCtxRef.current) {
      return;
    }
    const audioCtx = audioCtxRef?.current;
    if (audioCtx !== undefined) {
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
  }, [hz, length, rest]);

  return { beep }
}