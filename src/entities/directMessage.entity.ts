import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class DirectMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => User)
  receiver: User;

  @CreateDateColumn()
  sent_at: Date;
}
