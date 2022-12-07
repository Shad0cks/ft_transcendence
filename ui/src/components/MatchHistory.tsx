import useMatchHistory from '../customHooks/useMatchHistory.hook';
import { GetUserIt } from '../models/getUser';

interface MatchHistoryProps {
  searchedUser: GetUserIt;
}

export function MatchHistory(props: MatchHistoryProps) {
  const history = useMatchHistory(props.searchedUser.nickname);

  console.log(history);
  return <div>Yo</div>;
}
