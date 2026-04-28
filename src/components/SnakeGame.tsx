/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Trophy, RefreshCcw, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 150;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const generateFood = useCallback((currentSnake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood?.x && segment.y === newFood?.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsStarted(true);
    setScore(0);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
    }
  }, [direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isStarted || isGameOver) return;

    const moveSnake = () => {
      const newHead = {
        x: (snake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (snake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return;
      }

      const newSnake = [newHead, ...snake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => prev + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const intervalId = setInterval(moveSnake, SPEED);
    return () => clearInterval(intervalId);
  }, [snake, direction, food, isGameOver, isStarted, generateFood, highScore, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0);
      ctx.lineTo(i * size, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size);
      ctx.lineTo(canvas.width, i * size);
      ctx.stroke();
    }

    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#0ff' : '#000';
      ctx.strokeStyle = '#0ff';
      ctx.lineWidth = 2;
      
      ctx.fillRect(segment.x * size, segment.y * size, size, size);
      ctx.strokeRect(segment.x * size + 2, segment.y * size + 2, size - 4, size - 4);
    });

    ctx.fillStyle = '#f0f';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#f0f';
    ctx.fillRect(food.x * size + 4, food.y * size + 4, size - 8, size - 8);
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col gap-6 items-center w-full bg-black border-4 border-cyan-500 p-6 relative overflow-hidden shadow-[8px_8px_0px_#ff00ff]" id="snake-game-container">
      <div className="flex justify-between w-full items-center mb-2 border-b-2 border-cyan-500 pb-4" id="snake-hud">
        <div className="flex flex-col" id="score-display">
          <span className="text-[12px] uppercase tracking-tighter text-cyan-500 font-bold" id="score-label">{">"} DATA_COUNT</span>
          <span className="text-4xl font-black text-white font-mono leading-none" id="score-value">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end" id="high-score-display">
          <span className="text-[12px] uppercase tracking-tighter text-magenta-500 font-bold" id="high-score-label">BEST_SYNC {"<"}</span>
          <span className="text-2xl font-black text-white/40 font-mono leading-none" id="high-score-value">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative border-4 border-magenta-500 bg-black p-1" id="game-stage-wrapper">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="block w-full aspect-square max-w-[400px] pixelated"
          style={{ imageRendering: 'pixelated' }}
          id="game-canvas"
        />

        <AnimatePresence>
          {!isStarted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black flex flex-col items-center justify-center p-8 text-center z-20"
              id="start-overlay"
            >
              <div className="absolute inset-0 border-4 border-cyan-500 animate-pulse" />
              <h3 className="text-4xl font-black text-magenta-500 mb-4 glitch-text" data-text="INIT_NEURAL_SNAKE" id="game-title">INIT_NEURAL_SNAKE</h3>
              <p className="text-cyan-400 text-[10px] mb-8 font-mono tracking-widest uppercase" id="game-subtitle">Protocol: Feed the core. Avoid system corruption.</p>
              <button 
                onClick={resetGame}
                className="px-10 py-4 bg-cyan-500 text-black font-black uppercase tracking-widest hover:bg-magenta-500 hover:text-white transition-all transform hover:skew-x-12 active:scale-95 shadow-[4px_4px_0px_#ff00ff]"
                id="start-button"
              >
                EXECUTE_SESSION
              </button>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-8 text-center z-30"
              id="game-over-overlay"
            >
              <div className="absolute inset-0 border-8 border-red-600 animate-pulse" />
              <h3 className="text-6xl font-black text-red-600 mb-2 tracking-tighter italic" id="game-over-title">FATAL_ERROR</h3>
              <p className="text-white font-mono text-xs mb-10 bg-red-600 px-4 py-1 uppercase" id="game-over-subtitle">Memory leak at offset {snake[0].x}x{snake[0].y}</p>
              
              <div className="flex flex-col items-center gap-6" id="game-over-stats">
                 <div className="text-center p-4 border-2 border-cyan-500" id="final-score-display">
                    <div className="text-[10px] text-cyan-500 uppercase font-bold mb-2" id="final-score-label">Bytes Recovered</div>
                    <div className="text-5xl font-black text-white font-mono" id="final-score-value">{score}</div>
                 </div>
                 <button 
                    onClick={resetGame}
                    className="flex items-center gap-4 px-8 py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-cyan-500 hover:skew-x-[-12deg] transition-all"
                    id="restart-button"
                  >
                    <RefreshCcw className="w-5 h-5" id="restart-icon" />
                    REBOOT_CORE
                  </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 w-full text-[10px] font-mono text-cyan-500/50 uppercase tracking-tighter font-bold" id="controls-hint">
        <div className="border border-white/10 p-2 flex justify-between items-center" id="move-hint">
          <span>DIR_VECTORS:</span>
          <span className="text-white">[WASD_ARROWS]</span>
        </div>
        <div className="border border-white/10 p-2 flex justify-between items-center" id="action-hint">
          <span>SYNC_MODE:</span>
          <span className="text-white">[MANUAL]</span>
        </div>
      </div>
    </div>
  );
}
