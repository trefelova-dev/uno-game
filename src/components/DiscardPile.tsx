import type { Card as CardType } from '@/types/game';
import Card from './Card';
import { useEffect, useState } from 'react';

interface DiscardPileProps {
  cards: CardType[];
}

const DiscardPile = ({ cards }: DiscardPileProps) => {
  const [animatedCardId, setAnimatedCardId] = useState<string | null>(null);

  useEffect(() => {
    if (cards.length > 0) {
      setAnimatedCardId(cards[cards.length - 1].id);
    }
  }, [cards]);

  if (cards.length === 0) {
    return (
      <div className="w-20 h-29 bg-black/10 border-2 border-dashed border-black/20 rounded-xl flex items-center justify-center">
        <span className="text-gray-500 font-bold text-sm uppercase">Сброс</span>
      </div>
    );
  }

  const visibleCards = cards.slice(-5);

  return (
    <div className="relative w-20 h-29">
      <style>{`
        @keyframes flyInCard {
          0% { transform: translateY(-80px) scale(1.3) rotate(15deg); opacity: 0.5; }
          100% { transform: translateY(0) scale(1) rotate(var(--target-rotation)); opacity: 1; }
        }
        .card-fly-in {
          /* Используем cubic-bezier для эффекта пружинящего броска */
          animation: flyInCard 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
      
      {visibleCards.map((card, index) => {
        const hash = card.id.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
        const rotation = (Math.abs(hash) % 25) - 12;
        const isLatest = card.id === animatedCardId;
        
        return (
          <div 
            key={card.id} 
            className={`absolute inset-0 drop-shadow-md ${isLatest ? 'card-fly-in' : ''}`}
            style={{ 
              '--target-rotation': `${rotation}deg`,
              transform: isLatest ? 'none' : `rotate(${rotation}deg)`,
              zIndex: index 
            } as React.CSSProperties}
          >
            <Card card={card} isFaceUp={true} />
          </div>
        );
      })}
    </div>
  );
};

export default DiscardPile;