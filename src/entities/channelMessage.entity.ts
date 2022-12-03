import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './channel.entity';
import { ChannelParticipant } from './channelParticipant.entity';

@Entity()
export class ChannelMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => ChannelParticipant)
  sender: ChannelParticipant;

  @ManyToOne(() => Channel, (channel) => channel.messages)
  channel: Channel;

  @CreateDateColumn()
  sent_at: Date;
}
