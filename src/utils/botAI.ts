import type { Card, Player, PlayableColor } from '@/types/game';
import { isValidMove, pickMostFrequentColor } from './gameLogic';

interface BotDecision {
  cardToPlay: Card | null;
  newColor?: PlayableColor;
}

export const makeBotDecision = (bot: Player, topCard: Card): BotDecision => {
  const playableCards = bot.hand.filter((card) => isValidMove(card, topCard));

  if (playableCards.length === 0) {
    return { cardToPlay: null };
  }

  const cardToPlay = playableCards[Math.floor(Math.random() * playableCards.length)];

  if (cardToPlay.kind === 'wild') {
    const remainingHand = bot.hand.filter((card) => card.id !== cardToPlay.id);
    return { cardToPlay, newColor: pickMostFrequentColor(remainingHand) };
  }

  return { cardToPlay };
};
