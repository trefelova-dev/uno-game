import type { Player } from '@/types/game';

interface BotHandProps {
  bot: Player;
  position: 'top' | 'left' | 'right';
  isCurrentPlayer: boolean;
  isSkipped: boolean;
}

const BotHand = ({ bot, position, isCurrentPlayer, isSkipped }: BotHandProps) => {
  const isVertical = position === 'left' || position === 'right';
  
  const getCardStyle = (index: number, total: number) => {
    const offset = index - (total - 1) / 2;
    const angle = offset * 5; 
    
    let rotation = 180 + angle;
    if (position === 'left') rotation = 90 + angle;
    if (position === 'right') rotation = -90 + angle;

    return {
      transform: `rotate(${rotation}deg)`,
    };
  };

  return (
    <div className={`
      relative bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg transition-all duration-300 flex flex-col items-center gap-3
      ${isCurrentPlayer && !isSkipped ? 'ring-4 ring-yellow-400 scale-105 shadow-yellow-400/40' : ''}
      ${isSkipped ? 'opacity-70 grayscale' : ''}
      ${isVertical ? 'w-32' : 'min-w-48'}
    `}>
      <div className="text-center z-10">
        <h3 className={`font-bold text-sm ${isCurrentPlayer ? 'text-yellow-600' : 'text-gray-700'}`}>
          {bot.name} {isCurrentPlayer && '👑'}
        </h3>
        <p className="text-xs font-semibold text-gray-500">Карт: {bot.hand.length}</p>
      </div>

      <div className="h-4 z-10">
        {isCurrentPlayer && !isSkipped && (
          <span className="text-xs font-black text-yellow-600 animate-pulse drop-shadow-sm">Думает...</span>
        )}
      </div>

      <div className={`flex justify-center items-center ${isVertical ? '-space-y-10 flex-col' : '-space-x-4 flex-row'} pb-2`}>
        {bot.hand.map((card, index) => (
          <div key={card.id} className={`animate-draw-${position}`} style={{ zIndex: index }}>
              <div
                className="w-10 h-14 bg-gradient-to-br from-red-500 to-red-700 border border-white rounded shadow-md flex items-center justify-center transition-transform duration-300"
                style={getCardStyle(index, bot.hand.length)}
              >
                <span className="text-white font-black text-[8px] opacity-80" style={{ transform: 'rotate(-12deg)' }}>UNO</span>
              </div>
          </div>
        ))}
      </div>

      {isSkipped && (
        <div className="absolute inset-0 bg-red-500/20 rounded-2xl flex items-center justify-center backdrop-blur-sm z-20">
          <span className="text-red-600 text-4xl font-black drop-shadow-md">⊘</span>
        </div>
      )}
    </div>
  );
};

export default BotHand;