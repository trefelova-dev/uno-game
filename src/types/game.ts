export const CARD_COLORS = ['red', 'blue', 'green', 'yellow', 'wild'] as const;
export type CardColor = typeof CARD_COLORS[number];
export type PlayableColor = Exclude<CardColor, 'wild'>;
export const PLAYABLE_COLORS: PlayableColor[] = ['red', 'blue', 'green', 'yellow'];

export const NUMBER_VALUES = ['0','1','2','3','4','5','6','7','8','9'] as const;
export const ACTION_VALUES = ['skip', 'reverse', 'draw-two'] as const;
export const WILD_VALUES = ['wild', 'wild-draw-four'] as const;

export type NumberValue = typeof NUMBER_VALUES[number];
export type ActionValue = typeof ACTION_VALUES[number];
export type WildValue = typeof WILD_VALUES[number];
export type CardValue = NumberValue | ActionValue | WildValue;

export interface CardBase {
  id: string;
  color: CardColor;
}

export interface NumberCard extends CardBase {
  kind: 'number';
  value: NumberValue;
}

export interface ActionCard extends CardBase {
  kind: 'action';
  value: ActionValue;
}

export interface WildCard extends CardBase {
  kind: 'wild';
  value: WildValue;
  chosenColor?: Exclude<CardColor, 'wild'>;
}

export type Card = NumberCard | ActionCard | WildCard;

export interface Player {
  id: string;
  name: string;
  hand: Card[];        
  isBot?: boolean;
  isReady?: boolean;   
  score?: number;
  socketId?: string;
}

export interface PublicPlayer {
  id: string;
  name: string;
  cardCount: number;
  isBot?: boolean;
  isReady?: boolean;
  score?: number;
}

export type GameTheme = 'classic' | 'dark' | 'cute';

export type Direction = 1 | -1;

export interface GameState {
  deck: Card[];            
  discardPile: Card[];   
  players: Player[];       
  currentPlayerIndex: number;
  direction: Direction;
  winner: string | null;    
  theme: GameTheme;

  pendingColorChoice: boolean;
  drawnCardId: string | null;
  skippedPlayerIndex: number | null;

  pendingDrawCount?: number; 
  turnStartAt?: number | null;
  turnTimeoutMs?: number | null;

  readonly createdAt?: number;
  readonly updatedAt?: number;
}

export type PartialGameState = Partial<GameState>;
