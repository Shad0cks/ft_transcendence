import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChannelParticipant } from './channelParticipant.entity';

@Entity()
export class ChatRestriction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => ChannelParticipant,
    (channelParticipant) => channelParticipant.chatRestrictionsIncurred,
  )
  user: ChannelParticipant;

  @ManyToOne(
    () => ChannelParticipant,
    (channelParticipant) => channelParticipant.chatRestrictionsDealt,
  )
  admin: ChannelParticipant;

  //restriciton

  @Column({ type: 'timestamptz' })
  end: Date;
}
