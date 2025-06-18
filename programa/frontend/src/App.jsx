import './App.css';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Router } from './routes/router';


function App() {


  return (
    <BrowserRouter>
      <div className="App">
        <Router />
      </div>
    </BrowserRouter>
  );
}

export default App;
