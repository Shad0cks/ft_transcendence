import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistoryMatchs } from '../services/User/getHistoryMatchs';
import { historyMatchIt } from '../models/historyMatch';
import { disconnect } from '../services/User/userDelog';

export default function useMatchHistory(nickname: string) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const history = useRef<historyMatchIt[] | null>(null);

  useEffect(() => {
    getHistoryMatchs(nickname!)
      .then(async (e) => {
        if (e.status === 401) {
          disconnect(navigate);
        } else if (e.ok) {
          history.current = await e.json();
          console.log(history.current);
          if (!history.current) {
            disconnect(navigate);
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        disconnect(navigate);
      });
  });
  return { data: history.current, isLoading: isLoading };
}
