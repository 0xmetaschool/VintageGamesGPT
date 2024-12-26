'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Code, Play, Wand2 } from 'lucide-react';
import axios from 'axios';

const PingPongGame = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [showCode, setShowCode] = useState(false);
  const [editableCode, setEditableCode] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Game state
  const [gameState, setGameState] = useState({
    paddle1Y: 200,  // Player paddle
    paddle2Y: 200,  // AI paddle
    ballX: 300,
    ballY: 200,
    ballSpeedX: 5,
    ballSpeedY: 5,
    score1: 0,
    score2: 0,
    difficulty: 0.7  // AI difficulty (0-1)
  });

  // Game constants
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 400;
  const PADDLE_WIDTH = 10;
  const PADDLE_HEIGHT = 100;
  const BALL_SIZE = 10;
  const PADDLE_SPEED = 10;

  // AI Paddle Movement
  const moveAIPaddle = useCallback((ballY) => {
    const { paddle2Y, difficulty } = gameState;
    const centerPaddle = paddle2Y + PADDLE_HEIGHT / 2;
    const paddleSpeed = PADDLE_SPEED * difficulty;

    // Add some randomness to make AI less perfect
    const randomFactor = Math.random() * 10 - 5;
    
    if (ballY < centerPaddle - randomFactor) {
      return Math.max(0, paddle2Y - paddleSpeed);
    } else if (ballY > centerPaddle + randomFactor) {
      return Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, paddle2Y + paddleSpeed);
    }
    return paddle2Y;
  }, [gameState]);

  // Default game initialization
  const defaultInitGame = useCallback(() => {
    setGameState({
      paddle1Y: 200,
      paddle2Y: 200,
      ballX: 300,
      ballY: 200,
      ballSpeedX: 5,
      ballSpeedY: 5,
      score1: 0,
      score2: 0,
      difficulty: 0.7
    });
  }, []);

  // Initial setup
  useEffect(() => {
    // Initialize default game code
    setEditableCode(`// Custom Ping Pong Game Initialization
const initGame = () => {
  const defaultGameState = {
    paddle1Y: 200,
    paddle2Y: 200,
    ballX: 300,
    ballY: 200,
    ballSpeedX: 5,
    ballSpeedY: 5,
    score1: 0,
    score2: 0,
    difficulty: 0.7
  };
  
  setGameState(defaultGameState);
};

// You can customize game initialization logic here
`);

    // Initialize game
    defaultInitGame();
  }, [defaultInitGame]);

  // Game logic and rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw the game
    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw paddles
      ctx.fillStyle = 'white';
      ctx.fillRect(0, gameState.paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, gameState.paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Draw ball
      ctx.beginPath();
      ctx.arc(gameState.ballX, gameState.ballY, BALL_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.closePath();

      // Draw scores
      ctx.fillStyle = 'white';
      ctx.font = '30px Press Start 2P';
      ctx.fillText(gameState.score1.toString(), 100, 50);
      ctx.fillText(gameState.score2.toString(), CANVAS_WIDTH - 100, 50);
    };

    // Game loop
    const gameLoop = () => {
      // Calculate new ball position
      const newBallX = gameState.ballX + gameState.ballSpeedX;
      const newBallY = gameState.ballY + gameState.ballSpeedY;

      // AI Paddle Movement
      const newPaddle2Y = moveAIPaddle(newBallY);

      let newScore1 = gameState.score1;
      let newScore2 = gameState.score2;
      let finalBallX = newBallX;
      let finalBallY = newBallY;
      let newBallSpeedX = gameState.ballSpeedX;
      let newBallSpeedY = gameState.ballSpeedY;

      // Ball collision with top and bottom
      if (newBallY + BALL_SIZE / 2 > CANVAS_HEIGHT || newBallY - BALL_SIZE / 2 < 0) {
        newBallSpeedY = -gameState.ballSpeedY;
        finalBallY = newBallY;
      }

      // Ball collision with paddles
      if (
        (newBallX - BALL_SIZE / 2 < PADDLE_WIDTH && 
         newBallY > gameState.paddle1Y && 
         newBallY < gameState.paddle1Y + PADDLE_HEIGHT) ||
        (newBallX + BALL_SIZE / 2 > CANVAS_WIDTH - PADDLE_WIDTH && 
         newBallY > newPaddle2Y && 
         newBallY < newPaddle2Y + PADDLE_HEIGHT)
      ) {
        newBallSpeedX = -gameState.ballSpeedX;
        finalBallX = newBallX;
      }

      // Ball out of bounds
      if (finalBallX - BALL_SIZE / 2 < 0) {
        newScore2 += 1;
        finalBallX = CANVAS_WIDTH / 2;
        finalBallY = CANVAS_HEIGHT / 2;
        newBallSpeedX = Math.abs(gameState.ballSpeedX);
      } else if (finalBallX + BALL_SIZE / 2 > CANVAS_WIDTH) {
        newScore1 += 1;
        finalBallX = CANVAS_WIDTH / 2;
        finalBallY = CANVAS_HEIGHT / 2;
        newBallSpeedX = -Math.abs(gameState.ballSpeedX);
      }

      // Update game state
      setGameState(prev => ({
        ...prev,
        ballX: finalBallX,
        ballY: finalBallY,
        ballSpeedX: newBallSpeedX,
        ballSpeedY: newBallSpeedY,
        paddle2Y: newPaddle2Y,
        score1: newScore1,
        score2: newScore2
      }));

      // Draw the game
      draw();

      // Continue game loop
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    // Start game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, moveAIPaddle]);

  // Handle user input for moving player paddle
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent the default behavior of scrolling the page
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
      }

      setGameState(prev => {
        switch (e.key) {
          case 'ArrowUp':
            return {
              ...prev,
              paddle1Y: Math.max(0, prev.paddle1Y - PADDLE_SPEED)
            };
          case 'ArrowDown':
            return {
              ...prev,
              paddle1Y: Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, prev.paddle1Y + PADDLE_SPEED)
            };
          default:
            return prev;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toggle code view
  const toggleCodeView = () => {
    setShowCode(!showCode);
  };

  // Apply code changes
  const applyCodeChanges = () => {
    try {
      // Create a safe execution context with necessary game state and functions
      const safeContext = {
        setGameState,
        defaultInitGame
      };

      // Dynamically evaluate the code
      const initFunction = new Function(
        ...Object.keys(safeContext), 
        `return function() { 
          ${editableCode}
          return initGame;
        }`
      )(...Object.values(safeContext))();

      // Override default initialization with custom function
      if (typeof initFunction === 'function') {
        initFunction();
      } else {
        defaultInitGame();
      }

      alert('Code changes applied successfully!');
    } catch (error) {
      console.error('Error applying code changes:', error);
      alert('Failed to apply code changes. Please check your code.');
      // Fallback to default initialization
      defaultInitGame();
    }
  };

  // AI Suggestion method with improved error handling
  const getAiSuggestion = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter a prompt for AI suggestion');
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await axios.post('/api/pingpong', {
        prompt: `Modify the initGame function to: ${aiPrompt}
        
        Provide ONLY the function body. Do not include function declaration, code blocks, or any markdown. 
        Example output format (no code fences or extra text):
       
        const defaultGameState = {
           paddle1Y: 200,
           paddle2Y: 200,
           ballX: 300,
           ballY: 200,
           ballSpeedX: 5,
           ballSpeedY: 5,
           score1: 0,
           score2: 0,
           difficulty: 0.7
        };
      setGameState(defaultGameState);
       `,
        model: 'gpt-4o'
      });
  
      const suggestion = response.data.suggestion;
      
      setEditableCode(`const initGame = () => {
  ${suggestion.trim()}
};`);
  
      alert('AI suggestion applied. Apply changes to test.');
    } catch (error) {
      console.error('Detailed AI Suggestion Error:', error);
      alert(`Failed to get AI suggestion: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono relative">
      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1px_1px]"></div>
      </div>

      {/* CRT Screen Border */}
      <div className="container mx-auto px-4 py-8 relative z-20">
        <div className="max-w-6xl mx-auto bg-black border-t-8 border-l-8 border-r-8 border-b-8 border-gray-800 rounded-lg p-8 shadow-[0_0_15px_rgba(0,255,0,0.3)]">
        <h1 className="text-4xl font-bold text-center mb-8 text-white flex items-center justify-center gap-4">
          <Play className="text-gray-500" />
          Ping Pong Game (Player vs AI)
          <Code className="text-gray-500" />
        </h1>

          <div className="flex space-x-16 ml-8">
            {/* Game Container */}
            <div className={`${showCode ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
              <div className="flex flex-col items-center">
                {/* Game Canvas with CRT Effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-500/5 to-transparent pointer-events-none"></div>
                  <canvas 
                    ref={canvasRef} 
                    width={CANVAS_WIDTH} 
                    height={CANVAS_HEIGHT} 
                    className="border-4 border-gray-800 rounded-md shadow-[0_0_20px_rgba(0,255,0,0.2)] bg-gray-900"
                  />
                </div>

                {/* Score Display */}
                <div className="mt-6 bg-black border-2 border-gray-800 p-4 rounded-lg w-full max-w-xs">
                  <p className="text-2xl font-bold text-gray-500 text-center tracking-widest">
                    SCORE: {gameState.score1} - {gameState.score2}
                  </p>
                </div>

                {/* Control Buttons */}
                <div className="mt-4 flex gap-4">
                  <button 
                    onClick={defaultInitGame}
                    className="px-6 py-2 bg-gray-900 text-gray-500 border-2 border-gray-500 rounded hover:bg-gray-800 transition-colors shadow-[0_0_10px_rgba(0,255,0,0.3)]"
                  >
                    RESTART
                  </button>
                  <button 
                    onClick={toggleCodeView}
                    className="px-6 py-2 bg-gray-900 text-gray-500 border-2 border-gray-500 rounded hover:bg-gray-800 transition-colors shadow-[0_0_10px_rgba(0,0,255,0.3)]"
                  >
                    {showCode ? 'HIDE CODE' : 'SHOW CODE'}
                  </button>
                </div>
              </div>
            </div>

            {/* Code Editor with Retro Style */}
            {showCode && (
              <div className="w-1/2 bg-gray-900 border-2 border-gray-500 rounded-lg p-6 shadow-[0_0_15px_rgba(0,0,255,0.2)]">
                <div className="mb-4 flex items-center gap-2">
                  <Code className="text-gray-500" />
                  <h2 className="text-2xl font-bold text-gray-500">GAME CODE</h2>
                </div>
                <textarea
                  value={editableCode}
                  onChange={(e) => setEditableCode(e.target.value)}
                  className="w-full h-[350px] bg-black text-gray-500 border-2 border-gray-500 rounded p-4 font-mono text-sm focus:outline-none focus:border-gray-400 shadow-[0_0_10px_rgba(0,255,0,0.2)]"
                  placeholder="Edit your game code here..."
                />
                <div className="mt-4 space-y-4 text-bold ">
                  <button 
                    onClick={applyCodeChanges}
                    className="w-full py-2 bg-gray-900 text-gray-500 border-2 border-gray-500 rounded hover:bg-gray-800 transition-colors"
                  >
                    APPLY CHANGES
                  </button>
                  <div className="flex gap-2">
                    <input 
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Ask AI to modify the game..."
                      className="flex-grow bg-black text-gray-500 border-2 border-gray-500 rounded px-4 py-2"
                    />
                    <button 
                      onClick={getAiSuggestion}
                      disabled={isLoading}
                      className="px-4 py-2 bg-gray-900 text-gray-500 border-2 border-gray-500 rounded hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <Wand2 className="w-4 h-4" />
                      {isLoading ? 'Generating ...' : 'SUGGEST'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PingPongGame;