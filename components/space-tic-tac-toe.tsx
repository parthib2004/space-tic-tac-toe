'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export function SpaceTicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [winner, setWinner] = useState<string | null>(null)
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const newWinner = calculateWinner(board)
    if (newWinner) {
      setWinner(newWinner)
    } else if (board.every((square) => square !== null)) {
      setWinner('draw')
    }
  }, [board])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newPositions = [...Array(50)].map(() => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }));
      setPositions(newPositions);
    }
  }, []);

  const handleClick = (index: number) => {
    if (winner || board[index]) return

    const newBoard = [...board]
    newBoard[index] = xIsNext ? 'X' : 'O'
    setBoard(newBoard)
    setXIsNext(!xIsNext)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setXIsNext(true)
    setWinner(null)
  }

  const renderSquare = (index: number) => (
    <motion.button
      className="w-full h-full bg-opacity-30 bg-purple-700 rounded-lg flex items-center justify-center text-6xl font-bold text-white shadow-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleClick(index)}
      aria-label={`Square ${index + 1}`}
    >
      <AnimatePresence>
        {board[index] && (
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            {board[index]}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )

  const status = winner
    ? winner === 'draw'
      ? "It's a draw!"
      : `Winner: ${winner}`
    : `Next player: ${xIsNext ? 'X' : 'O'}`

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {positions.map((position, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: position.x,
              y: position.y,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </motion.div>
      <motion.h1
        className="text-4xl font-bold text-white mb-8"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        Space Tic-Tac-Toe
      </motion.h1>
      <motion.div
        className="grid grid-cols-3 gap-4 w-80 h-80 mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {[...Array(9)].map((_, index) => (
          <div key={index}>{renderSquare(index)}</div>
        ))}
      </motion.div>
      <motion.div
        className="text-xl font-semibold text-white mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {status}
      </motion.div>
      <Button
        onClick={resetGame}
        className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
      >
        Reset Game
      </Button>
    </div>
  )
}

function calculateWinner(squares: Array<string | null>): string | null {
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

export default SpaceTicTacToe