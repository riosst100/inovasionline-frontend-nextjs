"use client";

import { useEffect, useState } from "react";

export interface Countdown {
  hours: number;
  minutes: number;
  seconds: number;
  isDone: boolean;
}

const ZERO: Countdown = { hours: 0, minutes: 0, seconds: 0, isDone: false };

function getRemaining(targetTime: number): Countdown {
  const diff = Math.max(0, targetTime - Date.now());
  const totalSeconds = Math.floor(diff / 1000);

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isDone: diff <= 0,
  };
}

export function useCountdown(targetTime: number): Countdown {
  const [remaining, setRemaining] = useState<Countdown>(ZERO);

  useEffect(() => {
    const tick = () => setRemaining(getRemaining(targetTime));
    const interval = setInterval(tick, 1000);
    const timeout = setTimeout(tick, 0);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [targetTime]);

  return remaining;
}
