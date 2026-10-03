import type { 
  Card, 
  CardColor, 
  CardValue, 
  NumberValue, 
  ActionValue, 
  WildValue 
} from "@/types/game";

const NUMBER_VALUES: NumberValue[] = ['0','1','2','3','4','5','6','7','8','9'];
const ACTION_VALUES: ActionValue[] = ['skip','reverse','draw-two'];
const WILD_VALUES: WildValue[] = ['wild','wild-draw-four'];

export const createCard = (
  color: CardColor,
  value: CardValue,
  id?: string
): Card => {
  const cardId = id ?? crypto.randomUUID();

  if (NUMBER_VALUES.includes(value as NumberValue)) {
    return {
      id: cardId,
      color,
      value: value as NumberValue,
      kind: "number",
    };
  }

  if (ACTION_VALUES.includes(value as ActionValue)) {
    return {
      id: cardId,
      color,
      value: value as ActionValue,
      kind: "action",
    };
  }

  if (WILD_VALUES.includes(value as WildValue)) {
    return {
      id: cardId,
      color: "wild",
      value: value as WildValue,
      kind: "wild",
    };
  }

  throw new Error(`Unknown card value: ${value}`);
};
