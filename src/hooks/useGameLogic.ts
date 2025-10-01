import { useState, useEffect } from 'react';
import { GameState, Card, SlotPosition, Puzzle } from '@/types/game';

export function useGameLogic(initialPuzzle: Puzzle | null) {
  const [gameState, setGameState] = useState<GameState>({
    currentPuzzle: initialPuzzle,
    placedCards: {
      topLeft: null,
      topRight: null,
      bottomRight: null,
      bottomLeft: null,
    },
    attempts: 0,
    score: 0,
    isComplete: false,
    incorrectCards: {
      topLeft: false,
      topRight: false,
      bottomRight: false,
      bottomLeft: false,
    },
  });

  const [availableCards, setAvailableCards] = useState<Card[]>(initialPuzzle?.cards || []);

  // Load score from localStorage on mount
  useEffect(() => {
    const savedScore = localStorage.getItem('wordPuzzleScore');
    if (savedScore) {
      setGameState(prev => ({ ...prev, score: parseInt(savedScore) }));
    }
  }, []);

  // Save score to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wordPuzzleScore', gameState.score.toString());
  }, [gameState.score]);

  // Update available cards when puzzle changes
  useEffect(() => {
    if (initialPuzzle) {
      setAvailableCards(initialPuzzle.cards);
    }
  }, [initialPuzzle]);

  const rotateCard = (cardId: string) => {
    setAvailableCards(prev => 
      prev.map(card => 
        card.id === cardId 
          ? { ...card, rotation: ((card.rotation + 90) % 360) as 0 | 90 | 180 | 270 }
          : card
      )
    );
  };

  const placeCard = (card: Card, position: SlotPosition) => {
    // Remove card from available cards
    setAvailableCards(prev => prev.filter(c => c.id !== card.id));
    
    // If there's already a card in this position, return it to available cards
    const currentCard = gameState.placedCards[position];
    if (currentCard) {
      setAvailableCards(prev => [...prev, currentCard]);
    }

    setGameState(prev => ({
      ...prev,
      placedCards: {
        ...prev.placedCards,
        [position]: card,
      },
    }));
  };

  const removeCard = (position: SlotPosition) => {
    const card = gameState.placedCards[position];
    if (card) {
      setAvailableCards(prev => [...prev, card]);
      setGameState(prev => ({
        ...prev,
        placedCards: {
          ...prev.placedCards,
          [position]: null,
        },
      }));
    }
  };

  const checkSolution = () => {
    // Validate that all slots are filled. & that we have a valid puzzle
    if (!gameState.currentPuzzle) {
      return false;
    }

    const { placedCards, currentPuzzle } = gameState;
    const { puzzleSlots } = currentPuzzle;

    // Check if all slots are filled
    const allSlotsFilled = Object.values(placedCards).every(card => card !== null);
    if (!allSlotsFilled) {
      return false;
    }

    const incorrectCards = {
      topLeft: false,
      topRight: false,
      bottomRight: false,
      bottomLeft: false,
    };

    // Check that the top 2 cards top words match the top clue
    const topLeftCard = placedCards.topLeft;
    const topRightCard = placedCards.topRight;
    if (topLeftCard && topRightCard) {
      const topLeftCardTopWord = topLeftCard.words[(0 + topLeftCard.rotation / 90) % 4];
      const topRightCardTopWord = topRightCard.words[(0 + topRightCard.rotation / 90) % 4];
      const expectedTopWords = puzzleSlots.topLeft.words;
      
      const topWordsMatch = expectedTopWords.includes(topLeftCardTopWord) && 
                           expectedTopWords.includes(topRightCardTopWord) &&
                           topLeftCardTopWord !== topRightCardTopWord;
      
      if (!topWordsMatch) {
        incorrectCards.topLeft = true;
        incorrectCards.topRight = true;
      }
      console.log("topWordsMatch", topWordsMatch, topLeftCardTopWord, topRightCardTopWord, expectedTopWords, topWordsMatch);
    }

    // Check that the right 2 cards right words match the right clue
    const bottomRightCard = placedCards.bottomRight;
    if (topRightCard && bottomRightCard) {
      const topRightCardRightWord = topRightCard.words[(1 + topRightCard.rotation / 90) % 4];
      const bottomRightCardRightWord = bottomRightCard.words[(1 + bottomRightCard.rotation / 90) % 4];
      const expectedRightWords = puzzleSlots.topRight.words;
      
      const rightWordsMatch = expectedRightWords.includes(topRightCardRightWord) && 
                             expectedRightWords.includes(bottomRightCardRightWord) &&
                             topRightCardRightWord !== bottomRightCardRightWord;
      
      if (!rightWordsMatch) {
        incorrectCards.topRight = true;
        incorrectCards.bottomRight = true;
      }
    }

    // Check that the bottom 2 cards top words match the bottom clue
    const bottomLeftCard = placedCards.bottomLeft;
    if (bottomRightCard && bottomLeftCard) {
      const bottomRightCardTopWord = bottomRightCard.words[(0 + bottomRightCard.rotation / 90) % 4];
      const bottomLeftCardTopWord = bottomLeftCard.words[(0 + bottomLeftCard.rotation / 90) % 4];
      const expectedBottomWords = puzzleSlots.bottomLeft.words;
      
      const bottomWordsMatch = expectedBottomWords.includes(bottomRightCardTopWord) && 
                              expectedBottomWords.includes(bottomLeftCardTopWord) &&
                              bottomRightCardTopWord !== bottomLeftCardTopWord;
      
      console.log("bottomWordsMatch", bottomWordsMatch, bottomRightCardTopWord, bottomLeftCardTopWord, expectedBottomWords);
      
      if (!bottomWordsMatch) {
        incorrectCards.bottomRight = true;
        incorrectCards.bottomLeft = true;
      }
    }

    // Check that the left 2 cards left words match the left clue
    if (bottomLeftCard && topLeftCard) {
      const bottomLeftCardLeftWord = bottomLeftCard.words[(3 + bottomLeftCard.rotation / 90) % 4];
      const topLeftCardLeftWord = topLeftCard.words[(3 + topLeftCard.rotation / 90) % 4];
      const expectedLeftWords = puzzleSlots.bottomRight.words;
      
      const leftWordsMatch = expectedLeftWords.includes(bottomLeftCardLeftWord) && 
                            expectedLeftWords.includes(topLeftCardLeftWord) &&
                            bottomLeftCardLeftWord !== topLeftCardLeftWord;
      
      if (!leftWordsMatch) {
        incorrectCards.bottomLeft = true;
        incorrectCards.topLeft = true;
      }
    }

    console.log("incorrectCards", incorrectCards);

    // If all of the above are true, return true else return the incorrect cards
    const allCorrect = Object.values(incorrectCards).every(incorrect => !incorrect);
    console.log("allCorrect", allCorrect);
    return allCorrect;
  };

  const submitSolution = () => {
    const isCorrect = checkSolution();
    const newAttempts = gameState.attempts + 1;
    
    // Track which cards are incorrect by running the same logic as checkSolution
    const incorrectCards = {
      topLeft: false,
      topRight: false,
      bottomRight: false,
      bottomLeft: false,
    };
    
    if (!isCorrect && gameState.currentPuzzle) {
      const { placedCards, currentPuzzle } = gameState;
      const { puzzleSlots } = currentPuzzle;

      // Check that the top 2 cards top words match the top clue
      const topLeftCard = placedCards.topLeft;
      const topRightCard = placedCards.topRight;
      if (topLeftCard && topRightCard) {
        const topLeftCardTopWord = topLeftCard.words[(0 + topLeftCard.rotation / 90) % 4];
        const topRightCardTopWord = topRightCard.words[(0 + topRightCard.rotation / 90) % 4];
        const expectedTopWords = puzzleSlots.topLeft.words;
        
        const topWordsMatch = expectedTopWords.includes(topLeftCardTopWord) && 
                             expectedTopWords.includes(topRightCardTopWord) &&
                             topLeftCardTopWord !== topRightCardTopWord;
        
        if (!topWordsMatch) {
          incorrectCards.topLeft = true;
          incorrectCards.topRight = true;
        }
      }
      
      console.log("top??", incorrectCards)

      // Check that the right 2 cards right words match the right clue
      const bottomRightCard = placedCards.bottomRight;
      if (topRightCard && bottomRightCard) {
        const topRightCardRightWord = topRightCard.words[(1 + topRightCard.rotation / 90) % 4];
        const bottomRightCardRightWord = bottomRightCard.words[(1 + bottomRightCard.rotation / 90) % 4];
        const expectedRightWords = puzzleSlots.topRight.words;
        
        const rightWordsMatch = expectedRightWords.includes(topRightCardRightWord) && 
                               expectedRightWords.includes(bottomRightCardRightWord) &&
                               topRightCardRightWord !== bottomRightCardRightWord;
        
        if (!rightWordsMatch) {
          incorrectCards.topRight = true;
          incorrectCards.bottomRight = true;
        }
      }

      // Check that the bottom 2 cards top words match the bottom clue
      const bottomLeftCard = placedCards.bottomLeft;

      console.log("bottom??", incorrectCards);
            if (bottomRightCard && bottomLeftCard) {
        const bottomRightCardTopWord = bottomRightCard.words[(0 + bottomRightCard.rotation / 90) % 4];
        const bottomLeftCardTopWord = bottomLeftCard.words[(0 + bottomLeftCard.rotation / 90) % 4];
        const expectedBottomWords = puzzleSlots.bottomLeft.words;
        
        const bottomWordsMatch = expectedBottomWords.includes(bottomRightCardTopWord) && 
                                expectedBottomWords.includes(bottomLeftCardTopWord) &&
                                bottomRightCardTopWord !== bottomLeftCardTopWord;
        
        
        if (!bottomWordsMatch) {
          incorrectCards.bottomRight = true;
          incorrectCards.bottomLeft = true;
        }
      }

      // Check that the left 2 cards left words match the left clue
      console.log("left??", incorrectCards);
      if (bottomLeftCard && topLeftCard) {
        const bottomLeftCardLeftWord = bottomLeftCard.words[(3 + bottomLeftCard.rotation / 90) % 4];
        const topLeftCardLeftWord = topLeftCard.words[(3 + topLeftCard.rotation / 90) % 4];
        const expectedLeftWords = puzzleSlots.bottomRight.words;
        
        const leftWordsMatch = expectedLeftWords.includes(bottomLeftCardLeftWord) && 
                              expectedLeftWords.includes(topLeftCardLeftWord) &&
                              bottomLeftCardLeftWord !== topLeftCardLeftWord;
        
        if (!leftWordsMatch) {
          incorrectCards.bottomLeft = true;
          incorrectCards.topLeft = true;
        }
      }
    }
    
    let pointsEarned = 0;
    if (isCorrect) {
      if (newAttempts === 1) {
        pointsEarned = 6;
      } else if (newAttempts === 2) {
        pointsEarned = 5;
      } else {
        pointsEarned = 4; // All 4 pairs are correct
      }
    }

    setGameState(prev => ({
      ...prev,
      attempts: newAttempts,
      score: prev.score + pointsEarned,
      isComplete: isCorrect || newAttempts >= 3,
      incorrectCards,
    }));

    console.log("incorrectCards results", incorrectCards)

    return { isCorrect, pointsEarned };
  };

  const resetGame = () => {
    if (initialPuzzle) {
      setGameState({
        currentPuzzle: initialPuzzle,
        placedCards: {
          topLeft: null,
          topRight: null,
          bottomRight: null,
          bottomLeft: null,
        },
        attempts: 0,
        score: gameState.score, // Keep current score
        isComplete: false,
        incorrectCards: {
          topLeft: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
        },
      });
      setAvailableCards(initialPuzzle.cards);
    }
  };

  return {
    gameState,
    availableCards,
    rotateCard,
    placeCard,
    removeCard,
    submitSolution,
    resetGame,
  };
}
