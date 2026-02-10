'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseRestTimerOptions {
  defaultDuration?: number; // seconds, default 90
  onComplete?: () => void;
}

interface UseRestTimerReturn {
  remaining: number;
  duration: number;
  isRunning: boolean;
  progress: number; // 0 to 1
  start: (duration?: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

export function useRestTimer(options: UseRestTimerOptions = {}): UseRestTimerReturn {
  const { defaultDuration = 90, onComplete } = options;
  const [duration, setDuration] = useState(defaultDuration);
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!isRunning || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setIsRunning(false);
          // Play audio notification
          try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 880;
            gain.gain.value = 0.3;
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
          } catch {
            // Audio not available
          }
          onCompleteRef.current?.();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, remaining]);

  const start = useCallback(
    (customDuration?: number) => {
      const d = customDuration ?? defaultDuration;
      setDuration(d);
      setRemaining(d);
      setIsRunning(true);
    },
    [defaultDuration]
  );

  const pause = useCallback(() => setIsRunning(false), []);
  const resume = useCallback(() => {
    if (remaining > 0) setIsRunning(true);
  }, [remaining]);
  const reset = useCallback(() => {
    setIsRunning(false);
    setRemaining(0);
  }, []);

  const progress = duration > 0 ? 1 - remaining / duration : 0;

  return { remaining, duration, isRunning, progress, start, pause, resume, reset };
}
