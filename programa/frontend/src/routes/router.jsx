import {Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import GameConfig from '../pages/GameConfig';
import Game from '../pages/Game';
import Login from '../pages/Login';

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/game-config" element={<GameConfig />} />
            <Route path="/game" element={<Game />} />
        </Routes>
    );
}

