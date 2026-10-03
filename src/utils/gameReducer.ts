import type { Card, Direction, GameState, PlayableColor, Player } from '@/types/game';
import { createDeck, shuffleDeck } from '@/utils/deck';
import { getNextPlayerIndex, hasPlayableCard, isValidMove, pickMostFrequentColor } from '@/utils/gameLogic';

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'PLAY_CARD'; payload: { card: Card; playerIndex: number; chosenColor?: PlayableColor } }
  | { type: 'CHOOSE_COLOR'; payload: { color: PlayableColor } }
  | { type: 'DRAW_CARD'; payload: { playerIndex: number } }
  | { type: 'PLAY_DRAWN_CARD'; payload?: { chosenColor?: PlayableColor } }
  | { type: 'KEEP_DRAWN_CARD' };

export const initialGameState: GameState = {
  deck: [],
  discardPile: [],
  players: [],
  currentPlayerIndex: 0,
  direction: 1,
  winner: null,
  theme: 'classic',
  pendingColorChoice: false,
  drawnCardId: null,
  skippedPlayerIndex: null,
};

const createPlayers = (sourceDeck: Card[]): { players: Player[]; deck: Card[] } => {
  const deck = [...sourceDeck];
  const players: Player[] = [
    { id: 'player-1', name: 'Ты', hand: deck.splice(0, 7), isBot: false },
    { id: 'bot-1', name: 'Бот 1', hand: deck.splice(0, 7), isBot: true },
    { id: 'bot-2', name: 'Бот 2', hand: deck.splice(0, 7), isBot: true },
    { id: 'bot-3', name: 'Бот 3', hand: deck.splice(0, 7), isBot: true },
  ];
  return { players, deck };
};

const takeStartingCard = (deck: Card[]): { startCard: Card; deck: Card[] } => {
  const remaining = [...deck];
  const skipped: Card[] = [];

  while (remaining.length > 0) {
    const card = remaining.pop()!;
    if (card.kind === 'wild') {
      skipped.push(card);
      continue;
    }
    return { startCard: card, deck: shuffleDeck([...skipped, ...remaining]) };
  }

  return { startCard: skipped.pop()!, deck: skipped };
};

const drawFromDeck = (
  deck: Card[],
  discardPile: Card[],
  count: number
): { drawn: Card[]; deck: Card[]; discardPile: Card[] } => {
  let nextDeck = [...deck];
  let nextDiscard = [...discardPile];
  const drawn: Card[] = [];

  for (let i = 0; i < count; i += 1) {
    if (nextDeck.length === 0) {
      if (nextDiscard.length <= 1) {
        break;
      }
      const top = nextDiscard[nextDiscard.length - 1];
      nextDeck = shuffleDeck(nextDiscard.slice(0, -1));
      nextDiscard = [top];
    }

    const card = nextDeck.pop();
    if (!card) {
      break;
    }
    drawn.push(card);
  }

  return { drawn, deck: nextDeck, discardPile: nextDiscard };
};

const removeCardFromHand = (players: Player[], playerIndex: number, cardId: string): Player[] => {
  return players.map((player, index) => {
    if (index !== playerIndex) {
      return player;
    }
    return {
      ...player,
      hand: player.hand.filter((card) => card.id !== cardId),
    };
  });
};

const addCardsToHand = (players: Player[], playerIndex: number, cards: Card[]): Player[] => {
  return players.map((player, index) => {
    if (index !== playerIndex) {
      return player;
    }
    return {
      ...player,
      hand: [...player.hand, ...cards],
    };
  });
};

const withChosenColor = (card: Card, color?: PlayableColor): Card => {
  if (card.kind !== 'wild' || !color) {
    return card;
  }
  return { ...card, chosenColor: color };
};

const setTopCardColor = (state: GameState, color: PlayableColor): GameState => {
  if (state.discardPile.length === 0) {
    return state;
  }

  const top = state.discardPile[state.discardPile.length - 1];
  return {
    ...state,
    discardPile: [...state.discardPile.slice(0, -1), withChosenColor(top, color)],
  };
};

const applyPlayedCard = (state: GameState, playedCard: Card): GameState => {
  const playerCount = state.players.length;
  let direction = state.direction;
  let steps = 1;
  let skippedPlayerIndex: number | null = null;
  let { deck, discardPile, players } = state;

  if (playedCard.value === 'reverse') {
    direction = (direction === 1 ? -1 : 1) as Direction;
    if (playerCount === 2) {
      steps = 2;
      skippedPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, playerCount, direction, 1);
    }
  } else if (playedCard.value === 'skip') {
    steps = 2;
    skippedPlayerIndex = getNextPlayerIndex(state.currentPlayerIndex, playerCount, direction, 1);
  } else if (playedCard.value === 'draw-two' || playedCard.value === 'wild-draw-four') {
    const drawCount = playedCard.value === 'draw-two' ? 2 : 4;
    const victimIndex = getNextPlayerIndex(state.currentPlayerIndex, playerCount, direction, 1);
    const taken = drawFromDeck(deck, discardPile, drawCount);
    deck = taken.deck;
    discardPile = taken.discardPile;
    players = addCardsToHand(players, victimIndex, taken.drawn);
    steps = 2;
    skippedPlayerIndex = victimIndex;
  }

  const currentPlayer = players[state.currentPlayerIndex];
  const winner = currentPlayer.hand.length === 0 ? currentPlayer.name : null;
  const currentPlayerIndex = winner
    ? state.currentPlayerIndex
    : getNextPlayerIndex(state.currentPlayerIndex, playerCount, direction, steps);

  return {
    ...state,
    deck,
    discardPile,
    players,
    direction,
    currentPlayerIndex,
    winner,
    skippedPlayerIndex,
    pendingColorChoice: false,
    drawnCardId: null,
  };
};

const placeCardOnTable = (state: GameState, card: Card, playerIndex: number, chosenColor?: PlayableColor): GameState => {
  const playedCard = withChosenColor(card, chosenColor);
  return {
    ...state,
    players: removeCardFromHand(state.players, playerIndex, card.id),
    discardPile: [...state.discardPile, playedCard],
    drawnCardId: null,
    skippedPlayerIndex: null,
  };
};

const needsColorChoice = (card: Card, chosenColor?: PlayableColor): boolean => {
  return card.kind === 'wild' && !chosenColor;
};

const playCardOnTable = (state: GameState, card: Card, playerIndex: number, chosenColor?: PlayableColor): GameState => {
  const placed = placeCardOnTable(state, card, playerIndex, chosenColor);

  if (needsColorChoice(card, chosenColor)) {
    return {
      ...placed,
      pendingColorChoice: true,
    };
  }

  const topCard = placed.discardPile[placed.discardPile.length - 1];
  return applyPlayedCard(placed, topCard);
};

const passTurn = (state: GameState): GameState => {
  return {
    ...state,
    drawnCardId: null,
    skippedPlayerIndex: null,
    currentPlayerIndex: getNextPlayerIndex(
      state.currentPlayerIndex,
      state.players.length,
      state.direction
    ),
  };
};

const canAct = (state: GameState, playerIndex: number): boolean => {
  if (state.winner || state.pendingColorChoice) {
    return false;
  }
  if (state.players.length === 0) {
    return false;
  }
  return state.currentPlayerIndex === playerIndex;
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': {
      const originalDeck = shuffleDeck(createDeck());
      const { startCard, deck: remainingDeck } = takeStartingCard(originalDeck);
      const { players, deck } = createPlayers(remainingDeck);

      return {
        ...initialGameState,
        theme: state.theme,
        deck,
        discardPile: [startCard],
        players,
      };
    }

    case 'PLAY_CARD': {
      const { card, playerIndex, chosenColor } = action.payload;
      if (!canAct(state, playerIndex) || state.drawnCardId) {
        return state;
      }

      const player = state.players[playerIndex];
      const topCard = state.discardPile[state.discardPile.length - 1];
      const cardInHand = player?.hand.find((item) => item.id === card.id);

      if (!player || !topCard || !cardInHand || !isValidMove(cardInHand, topCard)) {
        return state;
      }

      return playCardOnTable(state, cardInHand, playerIndex, chosenColor);
    }

    case 'CHOOSE_COLOR': {
      if (!state.pendingColorChoice || state.discardPile.length === 0) {
        return state;
      }

      const colored = setTopCardColor(state, action.payload.color);
      const topCard = colored.discardPile[colored.discardPile.length - 1];
      return applyPlayedCard(colored, topCard);
    }

    case 'DRAW_CARD': {
      const { playerIndex } = action.payload;
      if (!canAct(state, playerIndex) || state.drawnCardId) {
        return state;
      }

      const player = state.players[playerIndex];
      const topCard = state.discardPile[state.discardPile.length - 1];
      if (!player || !topCard || hasPlayableCard(player, topCard)) {
        return state;
      }

      const taken = drawFromDeck(state.deck, state.discardPile, 1);
      if (taken.drawn.length === 0) {
        return passTurn({ ...state, deck: taken.deck, discardPile: taken.discardPile });
      }

      const drawnCard = taken.drawn[0];
      const players = addCardsToHand(state.players, playerIndex, taken.drawn);
      const withDrawnCard: GameState = {
        ...state,
        deck: taken.deck,
        discardPile: taken.discardPile,
        players,
        skippedPlayerIndex: null,
      };

      if (!isValidMove(drawnCard, topCard)) {
        return passTurn(withDrawnCard);
      }

      if (player.isBot) {
        const remainingHand = players[playerIndex].hand.filter((item) => item.id !== drawnCard.id);
        const chosenColor = drawnCard.kind === 'wild' ? pickMostFrequentColor(remainingHand) : undefined;
        return playCardOnTable(withDrawnCard, drawnCard, playerIndex, chosenColor);
      }

      return {
        ...withDrawnCard,
        drawnCardId: drawnCard.id,
      };
    }

    case 'PLAY_DRAWN_CARD': {
      if (!state.drawnCardId || state.pendingColorChoice || state.winner) {
        return state;
      }

      const playerIndex = state.currentPlayerIndex;
      const player = state.players[playerIndex];
      const drawnCard = player?.hand.find((card) => card.id === state.drawnCardId);
      const topCard = state.discardPile[state.discardPile.length - 1];

      if (!drawnCard || !topCard || !isValidMove(drawnCard, topCard)) {
        return state;
      }

      return playCardOnTable(state, drawnCard, playerIndex, action.payload?.chosenColor);
    }

    case 'KEEP_DRAWN_CARD': {
      if (!state.drawnCardId || state.pendingColorChoice || state.winner) {
        return state;
      }
      return passTurn(state);
    }

    default:
      return state;
  }
};
