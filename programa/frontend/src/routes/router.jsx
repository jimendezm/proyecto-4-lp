import {Routes, Route} from 'react-router-dom';
import Home from '../pages/Home';
import GameConfig from '../pages/GameConfig';
import Game from '../pages/Game';

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game-config" element={<GameConfig />} />
            <Route path="/game" element={<Game />} />
        </Routes>
    );
}

