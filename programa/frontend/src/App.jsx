// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { Router } from './routes/router';
import { SocketContext } from './pages/SocketContext';
import { useContext } from 'react';

let currkey = '';
let keyBatch = [];

function App() {
  const socket = useContext(SocketContext);

  document.addEventListener('keydown', (e) => {
    console.log(e.code);
    const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (arrows.includes(e.code)) {
      currkey = e.code;
    } else if (e.code === 'KeyU') {
      socket.emit('prep-change', socket.id);
    }
  });

  socket.on('ready', () => {
    setInterval(() => {
      if (currkey !== '' && keyBatch.length < 3) {
        keyBatch.push(currkey);
        currkey = '';
      }
    }, 100);

    setInterval(() => {
      socket.emit('gametick', socket.id.slice(0, 3), keyBatch);
      keyBatch = [];
    }, 500);
  })

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
