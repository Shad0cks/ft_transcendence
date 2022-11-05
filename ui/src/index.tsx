import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import NotFound from './pages/NotFound';
import MainGame from './pages/GamePage/MainGame';
import './index.css';
import PartyManage from './pages/HomePage/PartyManage';
import Channel from './pages/ChannelPage/channel';
import MainUserProfile from './pages/UserProfile/MainUserProfile';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/callback" element={<App />} />
      <Route path="/chat" element={<Channel />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/game_:id" element={<MainGame />} />
      <Route path="/channelManager" element={<PartyManage />} />
      <Route path="/editProfile" element={<MainUserProfile />} />
    </Routes>
  </BrowserRouter>,
);
