import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './channel.entity';
import { User } from './user.entity';

@Entity()
export class ChannelMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => Channel, (channel) => channel.messages)
  channel: Channel;

  @CreateDateColumn()
  sent_at: Date;
}
