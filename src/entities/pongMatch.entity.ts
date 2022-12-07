import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class PongMatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score1: number;

  @Column()
  score2: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  user1: User;

  @ManyToOne(() => User)
  user2: User;
}
