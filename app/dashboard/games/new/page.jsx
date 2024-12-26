'use client';

import { useState } from 'react';
import axios from 'axios';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Code, Play, Wand2, Star, Edit } from 'lucide-react';

export default function VintageGameGeneratorPage() {
  const [gameRequest, setGameRequest] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gameComponent, setGameComponent] = useState(null);
  const [error, setError] = useState(null);

  const generateGame = async () => {
    // Reset previous state
    setError(null);
    setGameComponent(null);
    setGeneratedCode('');

    // Validate input
    if (!gameRequest.trim()) {
      setError('Please describe the vintage black and white game you want to create');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/new', { 
        prompt: `Create a vintage black and white game: ${gameRequest}`
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 90000
      });

      // Validate response
      if (!response.data || !response.data.code) {
        throw new Error('Invalid response from server');
      }

      const generatedCodeResponse = response.data.code;
      setGeneratedCode(generatedCodeResponse);
      startGame(generatedCodeResponse);
    } catch (error) {
      console.error('Game generation error:', error);
      setError(error.response?.data?.error || 'Failed to generate game');
    } finally {
      setIsLoading(false);
    }
  };

  const startGame = (code) => {
    try {
      // Create a more flexible evaluation context
      const gameEvalContext = {
        React: React,
        useState: React.useState,
        useEffect: React.useEffect,
        console: console
      };

      // Create a function to evaluate the game component
      const createGameComponent = new Function(
        ...Object.keys(gameEvalContext), 
        `
        try {
          ${code}
          return GameComponent;
        } catch (error) {
          console.error('Component creation error:', error);
          throw error;
        }
      `
      );

      // Execute the function with the context
      const GeneratedGameComponent = createGameComponent(...Object.values(gameEvalContext));

      // Validate the component
      if (typeof GeneratedGameComponent !== 'function') {
        throw new Error('Invalid game component generated');
      }

      // Create a wrapper component with error handling
      const GameWrapper = () => {
        try {
          return (
            <div className="p-4 bg-gray-100 rounded-lg shadow-inner">
              <GeneratedGameComponent />
            </div>
          );
        } catch (error) {
          console.error('Game runtime error:', error);
          return (
            <div className="text-red-500 p-4 text-center">
              <h3 className="font-bold mb-2">Game Error</h3>
              <p>{error.message}</p>
            </div>
          );
        }
      };

      setGameComponent(<GameWrapper />);
      setError(null);
    } catch (error) {
      console.error('Game initialization error:', error);
      setError(error.message || 'Failed to start the game');
      setGameComponent(null);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode)
      .then(() => {
        alert('Game code copied to clipboard');
      })
      .catch((error) => {
        console.error('Failed to copy code:', error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-8 font-mono">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-white flex items-center justify-center gap-4">
          <Play className="text-green-500" />
          Vintage Game Generator
          <Code className="text-blue-500" />
        </h1>

        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Game Request Input */}
          <div className="w-full md:w-1/2 bg-gray-800 shadow-xl rounded-lg p-6">
            <Card className="w-full h-full bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Wand2 className="text-blue-500" />
                  Generate Vintage Game
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={gameRequest}
                  onChange={(e) => setGameRequest(e.target.value)}
                  className="w-full h-[350px] font-mono text-sm bg-gray-700 text-white border-2 border-gray-600"
                  placeholder="Describe a vintage black and white game (e.g., 'tic-tac-toe', 'Space Invaders', 'Pac-Man')"
                />
                <Button
                  onClick={generateGame}
                  disabled={isLoading}
                  className="mt-4 w-full bg-gray-600 hover:bg-gray-700 text-white"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Generating...
                    </span>
                  ) : (
                    'Generate Game'
                  )}
                </Button>
                {error && (
                  <div className="mt-4 p-4 bg-red-500 border border-red-600 rounded-md">
                    <p className="text-white text-sm">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Generated Game Display */}
          <div className="w-full md:w-1/2 bg-gray-800 shadow-xl rounded-lg p-6">
            <Card className="w-full h-full bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Play className="text-green-500" />
                  Game Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-4 border-gray-700 rounded-md shadow-md p-4 min-h-[400px] bg-gray-900">
                  {gameComponent || (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <p className="text-center">
                        Generated vintage game will appear here
                      </p>
                    </div>
                  )}
                </div>
                
                {generatedCode && (
                  <div className="flex flex-col space-y-2 mt-4">
                    <Button
                      onClick={copyCode}
                      variant="outline"
                      className="w-full border-gray-600 text-black hover:bg-gray-700 hover:text-white"
                    >
                      Copy Game Code
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}