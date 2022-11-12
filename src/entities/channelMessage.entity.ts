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

  @ManyToOne(
    () => ChannelParticipant,
    (channelParticipant) => channelParticipant.channelMessages,
  )
  sender: ChannelParticipant;

  @ManyToOne(() => Channel, (channel) => channel.channelMessages)
  channel: Channel;

  @CreateDateColumn()
  created_at: Date;
}
