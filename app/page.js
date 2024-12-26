'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const VintageGamesLanding = () => {
  const [activeGame, setActiveGame] = useState(null);
  const [activeCollection, setActiveCollection] = useState(null);

  const gameLibrary = [
    {
      id: 'pong',
      title: 'Pong',
      description: 'The game that started a revolution',
      difficulty: 'Easy',
      era: '1972',
      creator: 'Atari',
      color: 'bg-green-900',
      textColor: 'text-green-200',
      fullDescription: 'Pong is the groundbreaking table tennis sports game that launched the video game industry. Created by Allan Alcorn for Atari, it became the first commercially successful video game, paving the way for the entire gaming ecosystem we know today.',
      mechanics: ['Simple 2D paddle control', 'Basic physics simulation', 'Minimalist scoring']
    },
    {
      id: 'tetris',
      title: 'Tetris',
      description: 'Blocks that changed everything',
      difficulty: 'Medium',
      era: '1984',
      creator: 'Alexey Pajitnov',
      color: 'bg-blue-900',
      textColor: 'text-blue-200',
      fullDescription: 'Tetris is a tile-matching puzzle game designed and programmed by Soviet software engineer Alexey Pajitnov. Its simple yet addictive gameplay has made it one of the most popular video games of all time.',
      mechanics: ['Shape rotation', 'Rapid decision making', 'Spatial awareness']
    },
    {
      id: 'snake',
      title: 'Snake',
      description: 'Grow or die',
      difficulty: 'Hard',
      era: '1976',
      creator: 'Gremlin Industries',
      color: 'bg-red-900',
      textColor: 'text-red-200',
      fullDescription: 'The classic Snake game challenges players to control a growing snake, navigating it to eat food while avoiding collisions with walls and its own body. A test of reflexes and strategic planning.',
      mechanics: ['Directional movement', 'Growing length', 'Increasing difficulty']
    }
  ];

  const gameCollections = [
    {
      id: 'arcade',
      title: 'Arcade Classics',
      description: 'The ultimate collection of coin-op legends',
      games: ['Pac-Man', 'Space Invaders', 'Donkey Kong'],
      image: '/arcade-collection.jpg'
    },
    {
      id: 'console',
      title: 'Console Legends',
      description: 'Iconic games that defined home gaming',
      games: ['Super Mario', 'Zelda', 'Sonic'],
      image: '/console-collection.jpg'
    },
    {
      id: 'handheld',
      title: 'Portable Nostalgia',
      description: 'Pocket-sized gaming memories',
      games: ['Tetris GB', 'Pokemon Red', 'Mario Land'],
      image: '/handheld-collection.jpg'
    }
  ];

  return (
    <div className="bg-black text-white font-mono">
      {/* Scanline and Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1px_1px]"></div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center text-center px-4 py-24">
        <div className="max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-bold mb-6 tracking-wider uppercase"
          >
            Vintage Games <span className="text-gray-500 animate-in">GPT</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            Celebrating the golden age of gaming - where every pixel tells a story, and every game is a time machine
          </motion.p>
          <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white text-black px-10 py-4 text-xl font-bold rounded-lg shadow-lg hover:bg-gray-200 transition-all"
          >
            Explore Gaming History
          </motion.button>
          </Link>
        </div>
      </div>

      {/* Game Library Section */}
      <section className="container mx-auto px-4 py-24">
        <h2 className="text-5xl text-center mb-16 font-bold">Legendary Games</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {gameLibrary.map((game) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`
                ${game.color} 
                ${activeGame === game.id ? 'scale-105' : ''}
                border-4 border-white/10 
                p-6 rounded-xl 
                transform transition-all duration-300 
                hover:border-white/30 
                cursor-pointer
              `}
              onClick={() => setActiveGame(game.id === activeGame ? null : game.id)}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-3xl font-bold ${game.textColor}`}>
                  {game.title}
                </h3>
                <span className="text-xl text-gray-400">{game.era}</span>
              </div>
              <p className="text-gray-300 mb-4">{game.description}</p>
              <div className="flex justify-between items-center">
                <span className="px-3 py-1 bg-black/30 rounded">
                  Difficulty: {game.difficulty}
                </span>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="px-4 py-2 bg-white text-black font-bold rounded hover:bg-gray-200"
                >
                  About
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Expanded Game Details */}
        {activeGame && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-12 bg-gray-900 p-8 rounded-xl"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-4xl font-bold mb-4">
                  {gameLibrary.find(g => g.id === activeGame).title}
                </h4>
                <p className="text-gray-300 mb-4">
                  {gameLibrary.find(g => g.id === activeGame).fullDescription}
                </p>
                <div>
                  <h5 className="text-2xl mb-2">Game Mechanics</h5>
                  <ul className="list-disc pl-5 text-gray-400">
                    {gameLibrary.find(g => g.id === activeGame).mechanics.map((mechanic, index) => (
                      <li key={index}>{mechanic}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <h5 className="text-2xl mb-4">Historical Context</h5>
                <div className="bg-black/30 p-4 rounded">
                  <p>Creator: {gameLibrary.find(g => g.id === activeGame).creator}</p>
                  <p>Release Year: {gameLibrary.find(g => g.id === activeGame).era}</p>
                  <p>Impact: Revolutionary for its time</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Game Collections Section */}
      <section className="container mx-auto px-4 py-24 bg-gray-900">
        <h2 className="text-5xl text-center mb-16 font-bold">Curated Collections</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {gameCollections.map((collection) => (
            <motion.div
              key={collection.id}
              whileHover={{ scale: 1.05 }}
              className={`
                bg-black border-4 border-gray-800 rounded-xl overflow-hidden
                ${activeCollection === collection.id ? 'border-white' : ''}
              `}
              onClick={() => setActiveCollection(
                collection.id === activeCollection ? null : collection.id
              )}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={collection.image} 
                  alt={collection.title} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                />
              </div>
              <div className="p-6">
                <h3 className="text-3xl font-bold mb-2">{collection.title}</h3>
                <p className="text-gray-400 mb-4">{collection.description}</p>
                <div className="flex flex-wrap gap-2">
                  {collection.games.map((game) => (
                    <span 
                      key={game} 
                      className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                    >
                      {game}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Preservation Mission Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-5xl font-bold mb-12">Our Mission</h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-xl text-gray-400 mb-8">
            We're not just a gaming platform. We're digital archaeologists, preserving the 
            rich history of interactive entertainment. Every game is a time capsule, 
            every pixel a piece of cultural heritage.
          </p>
          <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white text-black px-10 py-4 text-xl font-bold rounded-lg shadow-lg hover:bg-gray-200 transition-all"
          >
            Join Our Preservation Effort
          </motion.button>
          </Link>
        </div>
      </section>

     
    </div>
  );
};

export default VintageGamesLanding;