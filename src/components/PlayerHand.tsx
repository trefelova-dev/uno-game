import type { Card as CardType } from '@/types/game';
import Card from './Card';
import { isValidMove } from '@utils/gameLogic';

interface PlayerHandProps {
  cards: CardType[];
  onPlayCard: (card: CardType) => void;
  isCurrentPlayer: boolean;
  isSkipped?: boolean;
  topCard: CardType | null;
  canDrawCard: boolean;
}

const PlayerHand = ({ cards, onPlayCard, isCurrentPlayer, isSkipped = false, topCard }: PlayerHandProps) => {
  if (cards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 font-bold">Нет карт в руке</p>
      </div>
    );
  }

  const getPlayableCards = () => {
    if (!topCard) return new Set();
    return new Set(cards.filter(card => isValidMove(card, topCard)).map(card => card.id));
  };

  const playableCards = getPlayableCards();
  const hasPlayableCards = playableCards.size > 0;

  return (
    <div className={`
      bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xl transition-all duration-300
      ${isCurrentPlayer && !isSkipped ? 'ring-4 ring-yellow-400 scale-[1.02] shadow-yellow-400/30' : ''}
      ${isSkipped ? 'grayscale' : ''}
    `}>
      <h3 className="text-xl font-bold text-center mb-2 text-gray-800">
        Твоя рука {isCurrentPlayer && !isSkipped && '👑'} {isSkipped && '⊘'}
      </h3>
      
      <div className="h-6 text-center mb-4">
        {isCurrentPlayer && !isSkipped && (
          hasPlayableCards ? (
            <span className="text-green-600 font-bold animate-pulse">Твой ход! Выбери карту</span>
          ) : (
            <span className="text-red-500 font-bold animate-pulse">Нечем ходить — бери из колоды</span>
          )
        )}
      </div>
      
      <div className="flex justify-center min-h-32 px-4">
        {cards.map((card, index) => {
          const isPlayable = playableCards.has(card.id) && isCurrentPlayer && !isSkipped;
          
          return (
            <div key={card.id} className="animate-draw-player" style={{ zIndex: index }}>
                <div 
                  className={`
                    transform transition-all duration-300 -ml-6 first:ml-0
                    ${isPlayable 
                      ? 'cursor-pointer -translate-y-4 hover:-translate-y-8 hover:z-50' 
                      : 'opacity-100 cursor-not-allowed filter brightness-75 hover:z-10'
                    }
                  `}
                >
                  <Card 
                    card={card} 
                    isFaceUp={true}
                    isSelectable={isPlayable}
                    onClick={() => isPlayable && onPlayCard(card)}
                  />
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerHand;