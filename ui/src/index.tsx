import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import NotFound from './pages/NotFound';
import MainGame from './pages/GamePage/MainGame';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/game_:id" element={<MainGame />} />
    </Routes>
  </BrowserRouter>,
);
