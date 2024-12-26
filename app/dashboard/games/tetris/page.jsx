'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Code, Play, Wand2 } from 'lucide-react';
import axios from 'axios';

const TetrisGame = () => {
  const canvasRef = useRef(null);
  const [grid, setGrid] = useState(Array(20).fill().map(() => Array(10).fill(0)));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [editableCode, setEditableCode] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Tetromino shapes and colors
  const tetrominos = [
    // I
    { shape: [
      [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
      [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1]],
      [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
      [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1]]
    ], color: 'cyan' },
    // O
    { shape: [
      [[1, 1], [1, 1]],
      [[1, 1], [1, 1]],
      [[1, 1], [1, 1]],
      [[1, 1], [1, 1]]
    ], color: 'yellow' },
    // T
    { shape: [
      [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
      [[1, 0, 0], [1, 1, 0], [1, 0, 0]],
      [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
      [[0, 1, 0], [0, 1, 1], [0, 1, 0]]
    ], color: 'purple' },
    // S
    { shape: [
      [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
      [[1, 0, 0], [1, 1, 0], [0, 1, 0]],
      [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
      [[1, 0, 0], [1, 1, 0], [0, 1, 0]]
    ], color: 'green' },
    // Z
    { shape: [
      [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
      [[0, 1, 0], [1, 1, 0], [1, 0, 0]],
      [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
      [[0, 1, 0], [1, 1, 0], [1, 0, 0]]
    ], color: 'red' },
    // J
    { shape: [
      [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
      [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
      [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
      [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
    ], color: 'blue' },
    // L
    { shape: [
      [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
      [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
      [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
      [[1, 1, 0], [0, 1, 0], [0, 1, 0]]
    ], color: 'orange' }
  ];

  // Grid configuration
  const gridSize = 20;
  const gridWidth = 10;
  const gridHeight = 20;

  // Initialize game
  const initGame = () => {
    const newGrid = Array(gridHeight).fill().map(() => Array(gridWidth).fill(0));
    setGrid(newGrid);
    setCurrentPiece(getRandomPiece());
    setNextPiece(getRandomPiece());
    setScore(0);
    setGameOver(false);
  };

  // Get a random Tetromino piece
  const getRandomPiece = () => {
    const index = Math.floor(Math.random() * tetrominos.length);
    return { ...tetrominos[index], rotation: 0, x: Math.floor(gridWidth / 2) - 1, y: 0 };
  };

  // Initial game setup
  useEffect(() => {
    // Set initial code for editing
    setEditableCode(`
const initGame = () => {
  // Initialize game state
  const newGrid = Array(gridHeight).fill().map(() => Array(gridWidth).fill(0));
  setGrid(newGrid);
  
  // Customize piece selection if needed
  const customPiece = getRandomPiece();
  
  setCurrentPiece(customPiece);
  setNextPiece(getRandomPiece());
  setScore(0);
  setGameOver(false);
};

// You can customize game initialization logic here
`);

    initGame();
  }, []);

  // Game logic useEffect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Draw the game grid and pieces
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the grid
      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          if (grid[y][x]) {
            ctx.fillStyle = grid[y][x];
            ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
          }
        }
      }

      // Draw the current piece
      if (currentPiece) {
        const { shape, rotation, x, y, color } = currentPiece;
        const piece = shape[rotation];
        for (let row = 0; row < piece.length; row++) {
          for (let col = 0; col < piece[row].length; col++) {
            if (piece[row][col]) {
              ctx.fillStyle = color;
              ctx.fillRect((x + col) * gridSize, (y + row) * gridSize, gridSize, gridSize);
            }
          }
        }
      }

      // Draw the next piece
      if (nextPiece) {
        const { shape, rotation, color } = nextPiece;
        const piece = shape[rotation];
        for (let row = 0; row < piece.length; row++) {
          for (let col = 0; col < piece[row].length; col++) {
            if (piece[row][col]) {
              ctx.fillStyle = color;
              ctx.fillRect((col + 6) * gridSize, (row + 2) * gridSize, gridSize, gridSize);
            }
          }
        }
      }
    };

    // Game loop
    let gameLoopInterval;
    if (!gameOver) {
      gameLoopInterval = setInterval(() => {
        // Move piece down every frame
        movePieceDown();
        draw();
      }, 500); // Increased speed
    } else {
      clearInterval(gameLoopInterval);
    }

    // Cleanup
    return () => clearInterval(gameLoopInterval);
  }, [grid, currentPiece, nextPiece, gameOver]);

  // Move piece down
  const movePieceDown = () => {
    if (!canMove(currentPiece, currentPiece.rotation, currentPiece.x, currentPiece.y + 1)) {
      // Place the piece on the grid
      placePiece(currentPiece);
      // Check for completed rows
      clearRows();
      // Set new current piece
      setCurrentPiece(nextPiece);
      // Get new next piece
      setNextPiece(getRandomPiece());
      // Check for game over
      if (!canMove(nextPiece, nextPiece.rotation, nextPiece.x, nextPiece.y)) {
        setGameOver(true);
      }
    } else {
      // Move the piece down
      setCurrentPiece(prev => ({ ...prev, y: prev.y + 1 }));
    }
  };

  // Check if the piece can move to a specific position
  const canMove = (piece, rotation, x, y) => {
    const shape = piece.shape[rotation];
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newX = x + col;
          const newY = y + row;
          if (
            newX < 0 ||
            newX >= gridWidth ||
            newY >= gridHeight ||
            (newY >= 0 && grid[newY][newX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };

  // Place the current piece on the grid
  const placePiece = (piece) => {
    const shape = piece.shape[piece.rotation];
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          grid[piece.y + row][piece.x + col] = piece.color;
        }
      }
    }
    setGrid([...grid]);
  };

  // Clear full rows and update score
  const clearRows = () => {
    let newGrid = [...grid];
    let rowsCleared = 0;
    for (let y = gridHeight - 1; y >= 0; y--) {
      if (newGrid[y].every(cell => cell)) {
        newGrid.splice(y, 1);
        newGrid.unshift(Array(gridWidth).fill(0));
        rowsCleared++;
      }
    }
    setGrid(newGrid);
    setScore(prevScore => prevScore + rowsCleared * 100);
  };

  // Handle user input for moving and rotating the piece
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      switch (e.key) {
        case 'ArrowLeft':
          if (canMove(currentPiece, currentPiece.rotation, currentPiece.x - 1, currentPiece.y)) {
            setCurrentPiece(prev => ({ ...prev, x: prev.x - 1 }));
          }
          break;
        case 'ArrowRight':
          if (canMove(currentPiece, currentPiece.rotation, currentPiece.x + 1, currentPiece.y)) {
            setCurrentPiece(prev => ({ ...prev, x: prev.x + 1 }));
          }
          break;
        case 'ArrowDown':
          movePieceDown();
          break;
        case 'ArrowUp':
          const nextRotation = (currentPiece.rotation + 1) % currentPiece.shape.length;
          if (canMove(currentPiece, nextRotation, currentPiece.x, currentPiece.y)) {
            setCurrentPiece(prev => ({ ...prev, rotation: nextRotation }));
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPiece, grid]);

  // Toggle code view
  const toggleCodeView = () => {
    setShowCode(!showCode);
  };

  // Handle code changes
  const handleCodeChange = (e) => {
    setEditableCode(e.target.value);
  };

  // Apply code changes
  const applyCodeChanges = () => {
    try {
      // Create a safe execution context with necessary game state and functions
      const safeContext = {
        gridHeight,
        gridWidth,
        setGrid,
        setCurrentPiece,
        setNextPiece,
        setScore,
        setGameOver,
        getRandomPiece,
        tetrominos
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
        initGame();
      }

      alert('Code changes applied successfully!');
    } catch (error) {
      console.error('Error applying code changes:', error);
      alert('Failed to apply code changes. Please check your code.');
      // Fallback to default initialization
      initGame();
    }
  };

  const getAiSuggestion = async () => {
    if (!aiPrompt.trim()) return;
  
    setIsLoading(true);
    try {
      const response = await axios.post('/api/tetris', {
        prompt: `Modify the initGame function to: ${aiPrompt}

        Provide ONLY the function body. Do not include function declaration, code blocks, or any markdown. 
        Example output format (no code fences or extra text):

          const initGame = () => {
          const newGrid = Array(gridHeight).fill().map(() => Array(gridWidth).fill(0));
          setGrid(newGrid);
          setCurrentPiece(getRandomPiece());
          setNextPiece(getRandomPiece());
          setScore(0);
          setGameOver(false);
          };`,
        model: 'gpt-4o'
      });
  
      const suggestion = response.data.suggestion;
      
      // Validate and sanitize the suggestion
      if (!suggestion || typeof suggestion !== 'string') {
        throw new Error('Invalid AI suggestion');
      }
  
      // Append the suggestion to the existing code
      // setEditableCode(prev => prev + '\n\n// AI Suggestion:\n' + suggestion);
      setEditableCode(`const initGame = () => {
        ${suggestion.trim()}
      };`);
  
      // Optional: Try to apply the suggestion
      try {
        // Use a safer evaluation method
        const suggestFunction = new Function('initGame, getRandomPiece, gridHeight, gridWidth', 
          `return function() { 
            ${suggestion} 
          }`
        )(initGame, getRandomPiece, gridHeight, gridWidth);
  
        // Call the suggestion function if it returns a function
        if (typeof suggestFunction === 'function') {
          suggestFunction();
        }
      } catch (evalError) {
        console.warn('Could not automatically apply suggestion:', evalError);
      }
  
      alert('AI suggestion added to the code.');
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      alert('Failed to get AI suggestion. Please try again.');
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
          Tetris Game
          <Code className="text-gray-500" />
        </h1>

          <div className="flex space-x-6">
            {/* Game Container */}
            <div className={`${showCode ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
              <div className="flex flex-col items-center">
                {/* Game Canvas with CRT Effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-500/5 to-transparent pointer-events-none"></div>
                  <canvas 
                    ref={canvasRef} 
                    width={200} 
                    height={400} 
                    className="border-4 border-gray-800 rounded-md shadow-[0_0_20px_rgba(0,255,0,0.2)]"
                  />
                </div>

                {/* Score Display */}
                <div className="mt-6 bg-black border-2 border-gray-800 p-4 rounded-lg w-full max-w-xs">
                  <p className="text-2xl font-bold text-gray-500 text-center tracking-widest">
                    SCORE: {score}
                  </p>
                </div>

                {/* Control Buttons */}
                <div className="mt-4 flex gap-4">
                  {gameOver && (
                    <button 
                      onClick={initGame}
                      className="px-6 py-2 bg-gray-900 text-gray-500 border-2 border-gray-500 rounded hover:bg-gray-800 transition-colors shadow-[0_0_10px_rgba(0,255,0,0.3)]"
                    >
                      RESTART
                    </button>
                  )}
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

export default TetrisGame;
