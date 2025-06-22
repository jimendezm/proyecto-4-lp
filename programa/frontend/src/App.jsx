// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { Router } from './routes/router';
import { socket, SocketContext } from './pages/SocketContext';

function App() {

  return (
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Router/>
      </BrowserRouter>
    </SocketContext.Provider>
  );
}

export default App;
