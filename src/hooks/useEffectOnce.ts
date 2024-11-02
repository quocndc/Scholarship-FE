import React, { useEffect, useRef } from 'react';

export function useEffectOnce(effect: React.EffectCallback) {
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender) {
      isFirstRender.current = false;
      return effect();
    }
  }, []);
}
