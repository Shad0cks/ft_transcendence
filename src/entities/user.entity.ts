import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';
import { HistoryMatch } from './historymatch.entity';

@Entity()
export class User {
  @PrimaryColumn({ unique: true })
  nickname: string;

  @Column()
  twofa_enabled: boolean;

  @Column({ select: false })
  twofa_secret: string;

  @Column({ select: false, unique: true })
  login42: string;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];

  @OneToMany(() => HistoryMatch, (match) => match.user)
  matchs: HistoryMatch[];

  @Column()
  avatar: string;

  @Column()
  wins: number;

  @Column()
  losses: number;
}
