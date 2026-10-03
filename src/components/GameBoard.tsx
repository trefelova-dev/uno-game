import { useEffect, useReducer } from 'react';
import type { Card as CardType, PlayableColor } from '@/types/game.ts';
import Card from './Card';
import Deck from './Deck';
import DiscardPile from './DiscardPile';
import PlayerHand from './PlayerHand';
import BotHand from './BotHand';
import ColorPickerModal from './ColorPickerModal';
import { getEffectiveColor, isValidMove } from '@utils/gameLogic';
import { makeBotDecision } from '@utils/botAI';
import { gameReducer, initialGameState } from '@utils/gameReducer';

const GameBoard = () => {
    const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

    const topCard = gameState.discardPile[gameState.discardPile.length - 1];
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const isPlayerTurn = Boolean(currentPlayer && !currentPlayer.isBot);
    const drawnCard = gameState.drawnCardId
        ? currentPlayer?.hand.find((card) => card.id === gameState.drawnCardId) ?? null
        : null;
    const currentColor = topCard ? getEffectiveColor(topCard) : null;

    useEffect(() => {
        const bot = gameState.players[gameState.currentPlayerIndex];

        if (!bot?.isBot || gameState.winner || gameState.pendingColorChoice || gameState.drawnCardId) {
            return;
        }

        const timer = setTimeout(() => {
            const tableTop = gameState.discardPile[gameState.discardPile.length - 1];
            if (!tableTop) return;

            const decision = makeBotDecision(bot, tableTop);
            if (decision.cardToPlay) {
                dispatch({
                    type: 'PLAY_CARD',
                    payload: {
                        card: decision.cardToPlay,
                        playerIndex: gameState.currentPlayerIndex,
                        chosenColor: decision.newColor,
                    },
                });
                return;
            }

            dispatch({
                type: 'DRAW_CARD',
                payload: { playerIndex: gameState.currentPlayerIndex },
            });
        }, 1500);

        return () => clearTimeout(timer);
    }, [
        gameState.currentPlayerIndex,
        gameState.winner,
        gameState.pendingColorChoice,
        gameState.drawnCardId,
        gameState.players,
        gameState.discardPile,
    ]);

    const canDrawCard = Boolean(
        isPlayerTurn &&
        !gameState.pendingColorChoice &&
        !drawnCard &&
        topCard &&
        currentPlayer.hand.every((card) => !isValidMove(card, topCard))
    );

    const handlePlayCard = (card: CardType) => {
        if (!isPlayerTurn) return;
        dispatch({
            type: 'PLAY_CARD',
            payload: { card, playerIndex: gameState.currentPlayerIndex },
        });
    };

    const handleDrawCard = () => {
        if (!isPlayerTurn) return;
        dispatch({
            type: 'DRAW_CARD',
            payload: { playerIndex: gameState.currentPlayerIndex },
        });
    };

    const handleChooseColor = (color: PlayableColor) => {
        dispatch({ type: 'CHOOSE_COLOR', payload: { color } });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4 flex flex-col xl:flex-row overflow-hidden">
            <style>{`
                @keyframes drawPlayer { from { opacity: 0; transform: translate(0, -300px) scale(0.2); } }
                @keyframes drawTop { from { opacity: 0; transform: translate(0, 300px) scale(0.2); } }
                @keyframes drawLeft { from { opacity: 0; transform: translate(300px, 0) scale(0.2); } }
                @keyframes drawRight { from { opacity: 0; transform: translate(-300px, 0) scale(0.2); } }
                
                .animate-draw-player { animation: drawPlayer 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards; }
                .animate-draw-top { animation: drawTop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards; }
                .animate-draw-left { animation: drawLeft 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards; }
                .animate-draw-right { animation: drawRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards; }
            `}</style>

            {/* Сайдбар: Название и кнопка */}
            <div className="flex flex-col items-center xl:items-start xl:w-64 mb-8 xl:mb-0 xl:pt-12 xl:pl-8 shrink-0">
                <h1 className="text-5xl font-black text-gray-800 mb-8 drop-shadow-sm tracking-tighter">UNO</h1>
                <button 
                    onClick={() => dispatch({ type: 'START_GAME' })}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 w-full max-w-[200px]"
                >
                    Новая игра
                </button>
            </div>

            <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto relative w-full h-full py-4">
                <div className="flex justify-center mb-2">
                    {gameState.players[2] && (
                    <BotHand bot={gameState.players[2]} position="top" isCurrentPlayer={gameState.currentPlayerIndex === 2} isSkipped={gameState.skippedPlayerIndex === 2} />
                    )}
                </div>

                <div className="flex justify-between items-center my-4">
                    <div className="flex justify-end items-center w-40">
                        {gameState.players[3] && (
                        <BotHand bot={gameState.players[3]} position="left" isCurrentPlayer={gameState.currentPlayerIndex === 3} isSkipped={gameState.skippedPlayerIndex === 3} />
                        )}
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        <div className="text-5xl font-black text-gray-400 drop-shadow-sm">
                            {gameState.direction === 1 ? '↺' : '↻'}
                        </div>
                        
                        <div className="flex gap-8 items-center">
                            <Deck deck={gameState.deck} onDrawCard={handleDrawCard} isEmpty={gameState.deck.length === 0} isDrawable={canDrawCard} />
                            <DiscardPile cards={gameState.discardPile} />
                        </div>

                        <div className="h-6">
                            {currentColor && currentColor !== 'wild' && (
                                <span className={`px-4 py-1 rounded-full text-white font-bold shadow-sm bg-uno-${currentColor}`}>
                                    Текущий цвет
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-start items-center w-40">
                        {gameState.players[1] && (
                        <BotHand bot={gameState.players[1]} position="right" isCurrentPlayer={gameState.currentPlayerIndex === 1} isSkipped={gameState.skippedPlayerIndex === 1} />
                        )}
                    </div>
                </div>

                <div className="flex justify-center mt-2">
                    <PlayerHand 
                        cards={gameState.players[0]?.hand || []}
                        onPlayCard={handlePlayCard}
                        isCurrentPlayer={gameState.currentPlayerIndex === 0 && !gameState.pendingColorChoice}
                        isSkipped={gameState.skippedPlayerIndex === 0}
                        topCard={topCard}
                        canDrawCard={canDrawCard}
                    />
                </div>
            </div>

            {gameState.pendingColorChoice && <ColorPickerModal onChoose={handleChooseColor} />}
            {drawnCard && !gameState.pendingColorChoice && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
                    <div className="bg-white rounded-2xl p-8 text-center shadow-2xl transform scale-105">
                        <h3 className="text-2xl font-bold mb-2">Новая карта!</h3>
                        <p className="text-gray-600 mb-6">Сыграть её сейчас или забрать в руку?</p>
                        <div className="flex justify-center mb-8">
                            <div className="animate-bounce">
                                <Card card={drawnCard} isFaceUp={true} />
                            </div>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => dispatch({ type: 'PLAY_DRAWN_CARD' })}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-green-500/30 transition-all"
                            >
                                Сыграть
                            </button>
                            <button
                                onClick={() => dispatch({ type: 'KEEP_DRAWN_CARD' })}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-xl shadow-lg transition-all"
                                >
                                Оставить
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {gameState.winner && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                        <div className="bg-white rounded-3xl p-10 text-center shadow-2xl">
                            <h2 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                                🎉 Игра окончена! 🎉
                            </h2>
                            <p className="text-2xl mb-8 font-semibold text-gray-700">
                                Победитель: {gameState.winner}
                            </p>
                            <button 
                                onClick={() => dispatch({ type: 'START_GAME' })}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-xl transition-transform hover:scale-105"
                            >
                                Сыграть еще раз
                            </button>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default GameBoard;