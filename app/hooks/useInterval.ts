import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void, N: number | undefined) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (N) {
      const int = setInterval(() => {
        callbackRef.current();
      }, N);

      return () => clearInterval(int);
    }
  }, [N]);
};
