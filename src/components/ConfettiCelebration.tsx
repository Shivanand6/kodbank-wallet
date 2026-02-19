import { useEffect, useState } from "react";

const CONFETTI_COLORS = [
  "hsl(45, 93%, 58%)",   // gold
  "hsl(35, 93%, 48%)",   // dark gold
  "hsl(142, 76%, 50%)",  // green
  "hsl(200, 80%, 60%)",  // blue
  "hsl(340, 80%, 60%)",  // pink
  "hsl(280, 70%, 60%)",  // purple
  "hsl(20, 90%, 60%)",   // orange
];

const SHAPES = ["■", "●", "▲", "★", "♦", "🎉", "🎊", "💰"];

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  shape: string;
  delay: number;
  duration: number;
  size: number;
}

const ConfettiCelebration = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const newPieces: ConfettiPiece[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      size: 12 + Math.random() * 16,
    }));
    setPieces(newPieces);

    const timer = setTimeout(() => setPieces([]), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti"
          style={{
            left: `${piece.x}%`,
            color: piece.color,
            fontSize: `${piece.size}px`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        >
          {piece.shape}
        </div>
      ))}
    </div>
  );
};

export default ConfettiCelebration;
