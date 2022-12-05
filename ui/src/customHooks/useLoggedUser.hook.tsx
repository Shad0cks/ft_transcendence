import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetUserIt } from '../models/getUser';
import { GetUserInfo } from '../services/User/getUserInfo';
import { disconnect } from '../services/User/userDelog';

export default function useLoggedUser() {
  const navigate = useNavigate();
  const loggedUser = useRef<GetUserIt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const nickname = localStorage.getItem('nickname');

  if (nickname === null) {
    disconnect(navigate);
  }
  useEffect(() => {
    GetUserInfo(nickname!).then(async (e) => {
      if (e.status === 401) {
        disconnect(navigate);
      } else if (e.ok) {
        loggedUser.current = await e.json();

        if (!loggedUser.current) {
          disconnect(navigate);
        }
        setIsLoading(false);
      }
    });
  });
  return { user: loggedUser.current, isLoading: isLoading };
}
