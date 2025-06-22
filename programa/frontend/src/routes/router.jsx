import {Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import GameConfig from '../pages/GameConfig';
import Game from '../pages/Game';
import Login from '../pages/Login';
import ListGames from '../pages/ListGames';
import Lobby from '../pages/Lobby';

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/game-config" element={<GameConfig />} />
            <Route path="/game" element={<Game />} />
            <Route path="/unirse" element={<ListGames />} />
            <Route path="/lobby" element={<Lobby />} />
        </Routes>
    );
}

