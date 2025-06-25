import React, { useContext } from 'react';
import { SocketContext } from '../pages/SocketContext';

let moves = [];
let currentMove = '';

export default function GameLogicTest() {
  const socket = useContext(SocketContext);

  document.addEventListener('keydown', (e) => {
    const arrowKeys = ['UpArrow', 'DownArrow', 'LeftArrow', 'RightArrow'];
    if (arrowKeys.includes(e.code)) {
      currentMove = e.code;
    }
  });

  setInterval(() => {
    if (moves.length < 3 && currentMove !== '') {
      moves.push(currentMove);
      currentMove = '';
    }
  }, 100);

  socket.on()

  return (
    <h1>Ingrese las teclas de flechas para moverse</h1>
  )
}
