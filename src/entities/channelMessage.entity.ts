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

  @ManyToOne(() => User, (user) => user.channelMessages)
  sender: User;

  @ManyToOne(() => Channel, (channel) => channel.channelMessages)
  channel: Channel;

  @CreateDateColumn()
  created_at: Date;
}
