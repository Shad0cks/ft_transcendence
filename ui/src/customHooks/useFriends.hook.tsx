import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetUserIt } from '../models/getUser';
import { GetFriends } from '../services/Friends/getFriends';
import { disconnect } from '../services/User/userDelog';

export default function useFriends(nickname: string) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const friendList = useRef<GetUserIt[]>([]);

  useEffect(() => {
    GetFriends(nickname).then(async (e) => {
      if (e.status === 401) {
        disconnect(navigate);
      } else if (e.ok) {
        friendList.current = await e.json();

        if (!friendList.current) {
          disconnect(navigate);
        }
        setIsLoading(false);
      }
    });
  });
  return { friendList: friendList.current, isLoading: isLoading };
}
