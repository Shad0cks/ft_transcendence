import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import FaPage from './pages/FaPage';
import NotFound from './pages/NotFound';
import MainGame from './pages/GamePage/MainGame';
import './index.css';
import PartyManage from './pages/HomePage/PartyManage';
import MainUserProfile from './pages/UserProfile/MainUserProfile';
import Friends from './pages/UserProfile/Friends';
import Register from './pages/Register';
import SearchUser from './pages/SearchPage/searchPage';
import Games from './pages/GamesPage/games';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/2fa" element={<FaPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/callback" element={<App />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/game_:id" element={<MainGame />} />
      <Route path="/channelManager" element={<PartyManage />} />
      <Route path="/editProfile" element={<MainUserProfile />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/search" element={<SearchUser />} />
      <Route path="/games" element={<Games />} />
    </Routes>
  </BrowserRouter>,
);
