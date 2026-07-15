import { useEffect, useRef, useState } from 'react';

export function useScrollChrome(idleMs = 900) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    lastY.current = window.scrollY;

    const clearIdle = () => {
      if (idleTimer.current != null) {
        window.clearTimeout(idleTimer.current);
        idleTimer.current = null;
      }
    };

    const showSoon = () => {
      clearIdle();
      idleTimer.current = window.setTimeout(() => {
        setHidden(false);
      }, idleMs);
    };

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY.current;

      if (currentY <= 24) {
        setHidden(false);
        clearIdle();
      } else if (Math.abs(delta) > 4) {
        setHidden(true);
        showSoon();
      }

      lastY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearIdle();
    };
  }, [idleMs]);

  return hidden;
}
