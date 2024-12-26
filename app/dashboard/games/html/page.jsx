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
    <div className="min-h-screen bg-black text-gray-300 font-mono relative">
      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1px_1px]"></div>
      </div>

      {/* CRT Screen Border */}
      <div className="container mx-auto px-4 py-8 relative z-20">
        <div className="max-w-6xl mx-auto bg-black border-8 border-gray-800 rounded-lg p-8 shadow-[0_0_15px_rgba(128,128,128,0.3)]">
          {/* Title */}
          <h1 className="text-6xl font-bold text-center mb-8 tracking-wider uppercase">
            Vintage Game Generator
          </h1>

          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            {/* Game Request Input */}
            <div className="w-full md:w-1/2">
              <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6 shadow-[0_0_10px_rgba(128,128,128,0.2)]">
                <div className="mb-4 flex items-center gap-2">
                  <Wand2 className="text-gray-500" />
                  <h2 className="text-2xl font-bold text-gray-400">GENERATE GAME</h2>
                </div>
                
                <textarea
                  value={gameRequest}
                  onChange={(e) => setGameRequest(e.target.value)}
                  className="w-full h-[350px] bg-black text-gray-300 border-2 border-gray-700 rounded p-4 font-mono text-sm 
                            focus:outline-none focus:border-gray-500 shadow-[0_0_10px_rgba(128,128,128,0.1)]
                            placeholder:text-gray-600"
                  placeholder="Describe a vintage black and white game..."
                />
                
                <button
                  onClick={generateGame}
                  disabled={isLoading}
                  className="mt-4 w-full py-3 bg-gray-800 text-gray-300 border-2 border-gray-700 
                           rounded hover:bg-gray-700 transition-colors uppercase tracking-wider
                           shadow-[0_0_10px_rgba(128,128,128,0.2)]"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-transparent"></div>
                      GENERATING...
                    </span>
                  ) : (
                    'GENERATE GAME'
                  )}
                </button>

                {error && (
                  <div className="mt-4 p-4 bg-gray-800 border-2 border-gray-600 rounded">
                    <p className="text-gray-300 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Game Preview */}
            <div className="w-full md:w-1/2">
              <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6 shadow-[0_0_10px_rgba(128,128,128,0.2)]">
                <div className="mb-4 flex items-center gap-2">
                  <Play className="text-gray-500" />
                  <h2 className="text-2xl font-bold text-gray-400">GAME PREVIEW</h2>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/5 to-transparent pointer-events-none"></div>
                  <iframe
                    ref={iframeRef}
                    className="w-full h-[400px] bg-black border-4 border-gray-800 rounded 
                             shadow-[0_0_15px_rgba(128,128,128,0.2)]"
                    sandbox="allow-scripts allow-same-origin"
                    title="Game Preview"
                  />
                </div>

                {generatedCode && (
                  <button
                    onClick={copyCode}
                    className="mt-4 w-full py-3 bg-gray-800 text-gray-300 border-2 border-gray-700 
                             rounded hover:bg-gray-700 transition-colors uppercase tracking-wider
                             shadow-[0_0_10px_rgba(128,128,128,0.2)]"
                  >
                    COPY GAME CODE
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}