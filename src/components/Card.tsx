import type { Card as CardType } from '@/types/game';
import SkipIcon from '@assets/icons/skip.svg?react';
import ReverseIcon from '@assets/icons/revers.svg?react';
import DrawTwoIcon from '@assets/icons/draw-two.svg?react';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isSelectable?: boolean;
  isFaceUp?: boolean;
}

const Card = ({ 
  card, 
  onClick, 
  isSelectable = false, 
  isFaceUp = true 
}: CardProps) => {
  if (!isFaceUp) {
    return (
      <div
        className={`w-20 h-28 bg-red-500 border-3 border-white rounded-sm shadow-lg transition-transform
          ${isSelectable ? 'hover:scale-105 cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-2xl">UNO</span>
        </div>
      </div>
    );
  }

  const displayColor = card.kind === 'wild' && card.chosenColor ? card.chosenColor : card.color;
  const bgColorClass = getCardColorClass(displayColor);
  const textColor = displayColor === 'wild' ? 'text-white' : 'text-black';

  return (
    <div
      className={`w-20 h-29 ${bgColorClass} border-3 border-white rounded-sm shadow-lg transition-transform ${isSelectable ? '-translate-y-2 cursor-pointer' : ''}`}
      style={{
        boxShadow: '0 0 0 2px black, 0 4px 6px rgba(0,0,0,0.2)',
      }}
      onClick={onClick}
    >

      <div className="w-full h-full px-2.5 py-2 flex flex-col items-center justify-between">
        <div className="self-start">
          <span className={`${textColor} font-bold text-lg`}>
            {getCardValue(card.value, textColor)}
          </span>
        </div>

        <div className="relative flex-1 flex items-center justify-center">
          <div
            className="absolute w-15 h-24 bg-white rounded-[50%]"
            style={{
              transform: 'skew(-26deg)',
              zIndex: 0,
            }}
          />
          <span className={`${textColor} font-bold text-4xl relative z-10`}>
            {getCardIcon(card.value, textColor)}
          </span>
        </div>

        <div className="self-end rotate-180">
          <span className={`${textColor} font-bold text-lg`}>
            {getCardValue(card.value, textColor)}
          </span>
        </div>
      </div>
    </div>
  );
};

const getCardIcon = (value: string, textColorClass: string) => {
  switch (value) {
    case 'skip': return <SkipIcon className={`w-10 h-10 ${textColorClass}`} strokeWidth="0"/>;
    case 'reverse': return <ReverseIcon className={`w-10 h-10 ${textColorClass}`} strokeWidth="0.5" />;
    case 'draw-two': return <DrawTwoIcon className={`w-10 h-10 ${textColorClass}`} strokeWidth="0.2" />;
    case 'wild': return <WildDotsIcon />;
    case 'wild-draw-four': return <WildDotsIcon />;

    default: return <span className={textColorClass}>{value}</span>;
  }
};

const getCardValue = (value: string, textColorClass: string) => {
  switch (value) {
    case 'skip': return <SkipIcon className={`w-4.5 h-4.5 ${textColorClass}`} strokeWidth="0"/>;
    case 'reverse': return <ReverseIcon className={`w-4.5 h-4.5 ${textColorClass}`} strokeWidth="0.5" />;
    case 'draw-two': return <span className={textColorClass}>+2</span>;
    case 'wild': return <span className={textColorClass}>W</span>;
    case 'wild-draw-four': return <span className={textColorClass}>+4</span>;

    default: return <span className={textColorClass}>{value}</span>;
  }
};

const WildDotsIcon = () => (
  <div className="relative w-10 h-10">
    <div
      className="absolute w-full h-full rounded-full"
      style={{
        background: `conic-gradient(
          var(--color-uno-red) 0% 25%,
          var(--color-uno-blue) 25% 50%,
          var(--color-uno-green) 50% 75%,
          var(--color-uno-yellow) 75% 100%
        )`,
        transform: 'rotate(-15deg)',
      }}
    />
    <div className="absolute w-8 h-8 bg-white rounded-full top-1 left-1"></div>
  </div>
);

const getCardColorClass = (color: string) => {
  switch (color) {
    case 'red': return 'bg-uno-red';
    case 'blue': return 'bg-uno-blue';
    case 'green': return 'bg-uno-green';
    case 'yellow': return 'bg-uno-yellow';
    case 'wild': return 'bg-gray-900'; 
    default: return 'bg-gray-500';
  }
};
export default Card;