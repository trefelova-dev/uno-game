import type { Card, CardColor, PlayableColor, Player } from '@/types/game';
import { PLAYABLE_COLORS } from '@/types/game';

export const getEffectiveColor = (card: Card): CardColor => {
  if (card.kind === 'wild') {
    return card.chosenColor ?? 'wild';
  }
  return card.color;
};

export const isValidMove = (card: Card, topCard: Card): boolean => {
  if (card.color === 'wild' || card.kind === 'wild') {
    return true;
  }

  const topColor = getEffectiveColor(topCard);

  if (card.color === topColor) {
    return true;
  }

  if (card.value === topCard.value) {
    return true;
  }

  return false;
};

export const getNextPlayerIndex = (
  currentIndex: number,
  playerCount: number,
  direction: 1 | -1,
  steps: number = 1
): number => {
  return (currentIndex + direction * steps + playerCount * 8) % playerCount;
};

export const pickMostFrequentColor = (hand: Card[]): PlayableColor => {
  const counts: Record<PlayableColor, number> = {
    red: 0,
    blue: 0,
    green: 0,
    yellow: 0,
  };

  for (const card of hand) {
    if (card.color !== 'wild') {
      counts[card.color] += 1;
    }
  }

  let best: PlayableColor = 'red';
  let max = -1;
  for (const color of PLAYABLE_COLORS) {
    if (counts[color] > max) {
      max = counts[color];
      best = color;
    }
  }

  return best;
};

export const hasPlayableCard = (player: Player, topCard: Card): boolean => {
  return player.hand.some((card) => isValidMove(card, topCard));
};
