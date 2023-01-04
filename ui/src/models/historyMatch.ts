import { GetUserIt } from './getUser';

export interface historyMatchIt {
  user1: GetUserIt;
  user2: GetUserIt;
  winner: string;
  score1: number;
  score2: number;
  created_at: Date;
}
