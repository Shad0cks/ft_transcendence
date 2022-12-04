import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetUserIt } from '../models/getUser';
import { GetUserInfo } from '../services/User/getUserInfo';
import { UserLogout } from '../services/User/userDelog';

export default function useLoggedUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState<GetUserIt>();
  const nickname = localStorage.getItem('nickname');

  useEffect(() => {
    if (nickname === null) navigate('/');
    else
      GetUserInfo(nickname!).then(async (e) => {
        if (e.status === 401) {
          await UserLogout();
          navigate('/');
        } else if (e.ok) e.text().then((i) => setUser(JSON.parse(i)));
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return user;
}
