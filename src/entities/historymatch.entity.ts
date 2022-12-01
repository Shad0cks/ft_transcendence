import {
  Column,
  PrimaryColumn,
  CreateDateColumn,
  Entity,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
@Entity()
export class HistoryMatch {
  @PrimaryColumn()
  player1: string;

  @Column()
  player2: string;

  @Column()
  score1: number;

  @Column()
  score2: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.matchs)
  user: User;
}
