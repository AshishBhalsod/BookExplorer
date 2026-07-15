import { useEffect, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import './FlyToFavorite.css';

export interface FlyPayload {
  imageUrl?: string;
  label: string;
  from: DOMRect;
}

interface FlyToFavoriteProps {
  payload: FlyPayload | null;
  onDone: () => void;
}

export function FlyToFavorite({ payload, onDone }: FlyToFavoriteProps) {
  const [style, setStyle] = useState<CSSProperties | null>(null);

  useEffect(() => {
    if (!payload) {
      setStyle(null);
      return;
    }

    const target = document.getElementById('nav-favorites');
    const to = target?.getBoundingClientRect();

    setStyle({
      top: payload.from.top,
      left: payload.from.left,
      width: payload.from.width,
      height: payload.from.height,
      opacity: 1,
      transform: 'scale(1)',
    });

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!to) {
          onDone();
          return;
        }
        setStyle({
          top: to.top + to.height / 2 - 18,
          left: to.left + to.width / 2 - 14,
          width: 28,
          height: 36,
          opacity: 0.35,
          transform: 'scale(0.35)',
        });
      });
    });

    const timer = window.setTimeout(() => {
      onDone();
      target?.classList.add('navbar__link--pulse');
      window.setTimeout(() => target?.classList.remove('navbar__link--pulse'), 450);
    }, 700);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [payload, onDone]);

  if (!payload || !style) return null;

  return createPortal(
    <div className="fly-fav" style={style} aria-hidden="true">
      {payload.imageUrl ? (
        <img src={payload.imageUrl} alt="" />
      ) : (
        <span>{payload.label.charAt(0)}</span>
      )}
    </div>,
    document.body,
  );
}
