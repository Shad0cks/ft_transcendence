import { ListGroup } from 'react-bootstrap';
import useMatchHistory from '../customHooks/useMatchHistory.hook';
import { GetUserIt } from '../models/getUser';
import { historyMatchIt } from '../models/historyMatch';
import { MatchCard } from './MatchCard';

interface MatchHistoryProps {
  searchedUser: GetUserIt;
}

export function MatchHistory(props: MatchHistoryProps) {
  const history = useMatchHistory(props.searchedUser.nickname);

  if (history.isLoading || !history.data) {
    return <div></div>;
  }

  return (
    <div>
      <ListGroup>
        {history.data.map((e: historyMatchIt, i: number) => {
          return (
            <MatchCard
              nickname1={e.user1.nickname}
              avatar1={e.user1.avatar}
              score1={e.score1}
              nickname2={e.user2.nickname}
              avatar2={e.user2.avatar}
              score2={e.score2}
              created_at={e.created_at}
              key={i}
            />
          );
        })}
      </ListGroup>
    </div>
  );
}
