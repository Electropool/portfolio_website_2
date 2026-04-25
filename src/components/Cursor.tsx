import { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      if (ringRef.current) {
        // slight delay for the ring can be achieved via CSS transition
        ringRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: -3,
          left: -3,
          width: 6,
          height: 6,
          backgroundColor: '#fff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 999999,
          willChange: 'transform'
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: -12,
          left: -12,
          width: 24,
          height: 24,
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 999998,
          transition: 'transform 0.1s ease-out',
          willChange: 'transform'
        }}
      />
    </>
  );
}
