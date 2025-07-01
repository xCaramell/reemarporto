import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Socials from "../components/about/socials";

import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/game.css";

const Game = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const currentSEO = SEO.find((item) => item.page === "game");

  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const winner = calculateWinner(board);
  const winningLine = getWinningLine(board);

  const handleClick = (index) => {
    if (board[index] || winner) return;
    const newBoard = board.slice();
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
    if (!winner) {
      computerMove(newBoard);
    }
  };

  const computerMove = (newBoard) => {
    const bestMove = findBestMove(newBoard);
    if (bestMove !== null) {
      newBoard[bestMove] = "O";
      setBoard(newBoard);
      setIsXNext(true);
    }
  };

  const findBestMove = (board) => {
    const emptySquares = board.map((val, index) => (val === null ? index : null)).filter(val => val !== null);
    if (emptySquares.length === 0) return null;

    // Check for winning move
    for (let i = 0; i < emptySquares.length; i++) {
      const index = emptySquares[i];
      board[index] = "O";
      if (calculateWinner(board)) {
        board[index] = null; // Reset
        return index; // Winning move found
      }
      board[index] = null; // Reset
    }

    // Block opponent's winning move
    for (let i = 0; i < emptySquares.length; i++) {
      const index = emptySquares[i];
      board[index] = "X";
      if (calculateWinner(board)) {
        board[index] = null; // Reset
        return index; // Block move found
      }
      board[index] = null; // Reset
    }

    // Choose random move if no winning or blocking move
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  const renderSquare = (index) => (
    <button className={`square ${winningLine && winningLine.includes(index) ? 'winner' : ''}`} onClick={() => handleClick(index)}>
      {board[index]}
    </button>
  );

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>
      <div className="status">
        {winner ? `Winner: ${winner}` : `Next player: ${isXNext ? "X" : "O"}`}
      </div>
      <div className="board">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      <button className="reset" onClick={resetGame}>Reset Game</button>
      <button className="back-home" onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const getWinningLine = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
};

export default Game;