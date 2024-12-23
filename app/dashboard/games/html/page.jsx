'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Code, Play, Wand2 } from 'lucide-react';

export default function VintageGameGeneratorPage() {
  const [gameRequest, setGameRequest] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  const generateGame = async () => {
    setError(null);
    setGeneratedCode('');

    if (!gameRequest.trim()) {
      setError('Please describe the vintage black and white game you want to create');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/html', { 
        prompt: `Create a vintage black and white game: ${gameRequest}`
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 90000
      });

      if (!response.data || !response.data.code) {
        throw new Error('Invalid response from server');
      }

      const generatedCodeResponse = response.data.code;
      setGeneratedCode(generatedCodeResponse);
      
      // Clear the iframe first
      clearIframe();
      
      // Wait a brief moment before rendering the new game
      setTimeout(() => {
        renderGame(generatedCodeResponse);
      }, 100);
      
    } catch (error) {
      console.error('Game generation error:', error);
      setError(error.response?.data?.error || 'Failed to generate game');
    } finally {
      setIsLoading(false);
    }
  };

  const clearIframe = () => {
    if (!iframeRef.current) return;
    
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    // Clear the iframe content
    iframeDoc.open();
    iframeDoc.write('');
    iframeDoc.close();
  };

  const renderGame = (code) => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    // Write the new content
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta http-equiv="Content-Security-Policy" 
                content="default-src 'self' 'unsafe-inline' 'unsafe-eval';">
          <style>
            body {
              margin: 0;
              overflow: hidden;
              background: black;
              color: white;
              font-family: monospace;
              width: 100%;
              height: 100vh;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            canvas {
              display: block;
              margin: 0 auto;
              max-width: 100%;
              max-height: 100vh;
            }
            .game-container {
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          </style>
        </head>
        <body>${code}</body>
      </html>
    `);
    iframeDoc.close();
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

  // Clear iframe when component unmounts or when generating new game
  useEffect(() => {
    return () => {
      clearIframe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-8">
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
                <div className="border-4 border-gray-700 rounded-md shadow-md p-4 min-h-[400px] bg-gray-800">
                  <iframe
                    ref={iframeRef}
                    className="w-full h-[400px] bg-gray-700"
                    sandbox="allow-scripts allow-same-origin"
                    title="Game Preview"
                  />
                </div>
                
                {generatedCode && (
                  <div className="flex flex-col space-y-2 mt-4">
                    <Button
                      onClick={copyCode}
                      variant="outline"
                      className="w-full border-gray-600 text-black hover:bg-gray-700"
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