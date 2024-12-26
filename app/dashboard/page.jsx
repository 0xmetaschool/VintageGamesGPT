'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const Dashboard = () => {
  return (
    <div className="bg-black text-white font-mono min-h-screen">
      {/* Scanline and Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1px_1px]"></div>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-6xl font-bold mb-6 tracking-wider uppercase text-center"
        >
          Vintage Games <span className="text-gray-500 animate-in">Dashboard</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto text-center"
        >
          Welcome to the dashboard where you can explore and play classic games from the golden age of gaming.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
          {/* Pingpong Card */}
          <Link href="dashboard/games/pingpong">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
            >
              <img src="/pingpong.png" alt="Pingpong" className="w-full h-48 object-cover rounded-t-lg mb-4 pixel-art" />
              <h2 className="text-2xl font-semibold mb-4 text-white font-retro">Pingpong</h2>
              <p className="text-gray-300 font-retro">Play a classic game of Pingpong and challenge your reflexes against AI.</p>
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
            </motion.div>
          </Link>

          {/* Snake Card */}
          <Link href="dashboard/games/snake">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
            >
              <img src="/snake.png" alt="Snake" className="w-full h-48 object-cover rounded-t-lg mb-4 pixel-art" />
              <h2 className="text-2xl font-semibold mb-4 text-white font-retro">Snake</h2>
              <p className="text-gray-300 font-retro">Navigate the snake to eat food and grow longer without hitting the walls.</p>
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
            </motion.div>
          </Link>

          {/* Tetris Card */}
          <Link href="dashboard/games/tetris">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden"
            >
              <img src="/tetris.png" alt="Tetris" className="w-full h-48 object-cover rounded-t-lg mb-4 pixel-art" />
              <h2 className="text-2xl font-semibold mb-4 text-white font-retro">Tetris</h2>
              <p className="text-gray-300 font-retro">Stack the falling blocks to create complete lines and score points.</p>
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
            </motion.div>
          </Link>

          {/* Create New Game Card */}
          <Link href="/dashboard/games/html">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="text-6xl text-gray-400 font-retro mt-32">+</div>
              <p className="text-gray-300 mt-2 ml-2 font-retro mb-32">Create a new game</p>
              <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;