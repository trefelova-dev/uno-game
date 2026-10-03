import { createCard } from "./cards";
import type { Card, CardColor, NumberValue, ActionValue } from "@/types/game";

const COLORS: CardColor[] = ["red", "blue", "green", "yellow"];
const NUMBER_VALUES: NumberValue[] = ['0','1','2','3','4','5','6','7','8','9'];
const ACTION_VALUES: ActionValue[] = ['skip','reverse','draw-two'];

export const createDeck = (): Card[] => {
  const deck: Card[] = [];

  for (const color of COLORS) {
    for (const value of [...NUMBER_VALUES, ...ACTION_VALUES]) {
      const count = value === "0" ? 1 : 2;
      for (let i = 0; i < count; i++) {
        deck.push(createCard(color, value));
      }
    }
  }

  for (let i = 0; i < 4; i++) {
    deck.push(createCard("wild", "wild"));
    deck.push(createCard("wild", "wild-draw-four"));
  }

  return deck;
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const arr = deck.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
