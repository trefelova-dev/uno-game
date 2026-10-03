import type { Card as CardType } from '@/types/game';
import Card from './Card';

interface DeckProps {
  deck: CardType[];
  onDrawCard: () => void;
  isEmpty: boolean;
  isDrawable: boolean;
}

const Deck = ({ deck, onDrawCard, isEmpty, isDrawable}: DeckProps) => {
  if (isEmpty) {
    return (
      <div className="w-20 h-28 bg-gray-300 border-2 border-gray-400 rounded-lg flex items-center justify-center">
        <span className="text-gray-600 text-sm">Пусто</span>
      </div>
    );
  }

  const topCards = deck.slice(-3);

  return (
    <div 
      className={`
        relative transition-all duration-200
        ${isDrawable 
          ? 'cursor-pointer hover:scale-105' 
          : 'cursor-not-allowed opacity-60'
        }
      `}
      onClick={isDrawable ? onDrawCard : undefined}
    >
      {topCards.map((card, index) => (
        <div
          key={card.id}
          className="absolute"
          style={{
            transform: `translate(${index * 2}px, ${index * 2}px)`,
            zIndex: index
          }}
        >
          <Card card={card} isFaceUp={false} />
        </div>
      ))}
      <div className="w-20 h-28 opacity-0"></div>
      
    </div>
  );
};

export default Deck;