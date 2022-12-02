import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Channel } from './channel.entity';
import { User } from './user.entity';

@Entity()
@Unique(['user', 'channel'])
export class ChannelParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isAdmin: boolean;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Channel, (channel) => channel.participants)
  channel: Channel;
}
