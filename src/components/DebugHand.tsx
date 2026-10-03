import type { Player } from '@/types/game';
import Card from './Card';

interface DebugHandProps {
  player: Player;
  isCurrent: boolean;
}

const DebugHand = ({ player, isCurrent }: DebugHandProps) => {
  return (
    <div className={`bg-gray-200/50 p-3 rounded-lg ${isCurrent ? 'ring-2 ring-yellow-400' : ''}`}>
      <h4 className="font-semibold text-center mb-2">
        {player.name} {isCurrent && '👑'}
      </h4>
      <div className="flex flex-wrap gap-1 justify-center">
        {player.hand.map(card => (
          <Card key={card.id} card={card} isFaceUp={true} />
        ))}
      </div>
      <div className="text-center text-sm text-gray-600 mt-1">
        Карт: {player.hand.length}
      </div>
    </div>
  );
};

export default DebugHand;