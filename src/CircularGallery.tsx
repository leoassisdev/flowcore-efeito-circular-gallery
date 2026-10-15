// Adaptado por FlowCore Soluções LTDA · flowcoresolucoes.com.br/codigos
// Original: React Bits (MIT + Commons Clause). Mantenha este crédito.

import { useEffect, useRef, useState } from "react";
import "./CircularGallery.css";

type Item = { src: string; label?: string };

type Props = {
  items?: Item[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  className?: string;
};

const DEFAULT_ITEMS: Item[] = [
  { src: "/brand/mockups/novo-01.webp", label: "FlowCore" },
  { src: "/brand/mockups/novo-13.webp", label: "Engenharia" },
  { src: "/brand/mockups/novo-05.webp", label: "Sistemas" },
  { src: "/brand/mockups/novo-09.webp", label: "IA" },
  { src: "/brand/mockups/novo-16.webp", label: "Segurança" },
  { src: "/brand/manual/manual-h1.webp", label: "Contato" },
];

const CircularGallery = ({
  items = DEFAULT_ITEMS,
  bend = 1,
  textColor = "#FFFFFF",
  borderRadius = 12,
  className = "",
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState({ active: false, startX: 0, scrollLeft: 0 });
  const offsetRef = useRef(0);

  useEffect(() => {
    let raf: number;
    let lastT = 0;
    const animate = (t: number) => {
      raf = requestAnimationFrame(animate);
      if (drag.active) {
        lastT = t;
        return;
      }
      const dt = lastT ? Math.min(0.1, (t - lastT) / 1000) : 0.016;
      lastT = t;
      offsetRef.current += dt * 30;
      const track = trackRef.current;
      if (track) {
        track.style.transform = `translateX(${-offsetRef.current}px)`;
        if (offsetRef.current > track.scrollWidth / 2) offsetRef.current = 0;
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [drag.active]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setDrag({ active: true, startX: e.clientX, scrollLeft: offsetRef.current });
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!drag.active) return;
    offsetRef.current = drag.scrollLeft - (e.clientX - drag.startX);
  };
  const handlePointerUp = () => setDrag({ ...drag, active: false });

  return (
    <div
      ref={containerRef}
      className={`circular-gallery ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div ref={trackRef} className="circular-gallery-track">
        {[...items, ...items].map((it, i) => {
          const total = items.length * 2;
          const progress = (i / total) * 2 - 1;
          const curveY = bend * Math.abs(progress) * 60;
          const rotate = bend * progress * 12;
          return (
            <div
              key={i}
              className="circular-gallery-item"
              style={{
                transform: `translateY(${curveY}px) rotate(${rotate}deg)`,
                borderRadius,
              }}
            >
              <img src={it.src} alt={it.label || ""} draggable={false} />
              {it.label && (
                <span className="circular-gallery-label" style={{ color: textColor }}>
                  {it.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CircularGallery;
