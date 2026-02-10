'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PRESETS = [60, 90, 120, 180];

export function RestTimer() {
  const [duration, setDuration] = useState(90);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  useEffect(() => {
    if (!running) {
      clear();
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setRunning(false);
          // Vibrate on finish if supported
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clear;
  }, [running, clear]);

  const start = () => {
    setRemaining(duration);
    setRunning(true);
  };

  const toggle = () => {
    if (remaining === 0) {
      start();
    } else {
      setRunning((r) => !r);
    }
  };

  const reset = () => {
    setRunning(false);
    setRemaining(0);
  };

  const pct = duration > 0 ? ((duration - remaining) / duration) * 100 : 0;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div className="bg-surface rounded-3xl border border-border p-6">
      <h3 className="font-bold text-lg mb-4">Repos</h3>

      {/* Presets */}
      <div className="flex gap-2 mb-6">
        {PRESETS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setDuration(s);
              if (!running) setRemaining(0);
            }}
            className={`flex-1 min-h-[48px] rounded-xl text-sm font-semibold transition-colors ${
              duration === s
                ? 'bg-brand/20 text-brand border border-brand/30'
                : 'bg-border/50 text-gray-400 hover:text-white'
            }`}
          >
            {s >= 60 ? `${s / 60}min` : `${s}s`}
          </button>
        ))}
      </div>

      {/* Timer display */}
      <div className="text-center mb-6">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#27272a"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#f97316"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 56}
              strokeDashoffset={2 * Math.PI * 56 * (1 - pct / 100)}
              className="transition-all duration-1000 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold tabular-nums">
              {mins}:{secs.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          variant="primary"
          className="flex-1 min-h-[64px] text-lg gap-2"
          onClick={toggle}
        >
          {running ? <Pause size={22} /> : <Play size={22} />}
          {running ? 'Pause' : remaining > 0 ? 'Reprendre' : 'Démarrer'}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="min-h-[64px] min-w-[64px]"
          onClick={reset}
        >
          <RotateCcw size={22} />
        </Button>
      </div>
    </div>
  );
}
