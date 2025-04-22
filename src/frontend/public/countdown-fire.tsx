import React, { useEffect, useState, useRef } from 'react';
import { lightPads, setupPadsClient } from '@frontend/common/pads-client';
import styles from './countdown-fire.module.scss';

interface CountdownTimerProps {
  initialSeconds: number;
  onComplete?: () => void; 
  onPadsUpdate?: (pads: Set<number>) => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialSeconds, onComplete, onPadsUpdate }) => {
  const socketRef = useRef<WebSocket | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [pads, setPads] = useState(new Set<number>());
  let currentPads = pads;

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = new WebSocket('ws://localhost:13254');
    }
    setupPadsClient(socketRef.current, (padsState) => {
      const retrievedPads = new Set<number>(currentPads);

      for (let key in padsState) {
        if (key === 'count' || padsState[key] !== 'R' || parseInt(key) < 0) 
          continue;
        const padId = parseInt(key);
        if (retrievedPads) {
          retrievedPads.add(padId);
        }
      }

      if (socketRef.current) {
        lightPads(socketRef.current, currentPads);
      }
      setPads(retrievedPads);
      currentPads = retrievedPads;
      if (onPadsUpdate) {
        onPadsUpdate(retrievedPads);
      }
    });

    if (secondsLeft <= 0) {
      if (socketRef.current) {
        lightPads(socketRef.current, new Set());
      }
      if (onComplete) {
        onComplete();
        if (socketRef.current) {
          socketRef.current.close();
          socketRef.current = null;
        }
      }
      return;
    }
  }, [secondsLeft, onComplete]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    }
  }, [secondsLeft]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const secsLeft = secs % 60;
    return `${mins}:${secsLeft.toString().padStart(2, '0')}`;
  };

  return (
    <p className={styles.countdown}>
      {formatTime(secondsLeft)}
    </p>
  );
};

export default CountdownTimer;
