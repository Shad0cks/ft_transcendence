import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChannelParticipant } from './channelParticipant.entity';

export type ChannelRestrictionType = 'ban' | 'mute';

@Entity()
export class ChatRestriction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChannelParticipant)
  punishedParticipant: ChannelParticipant;

  @ManyToOne(() => ChannelParticipant)
  adminParticipant: ChannelParticipant;

  @Column({
    type: 'enum',
    enum: ['ban', 'mute'],
  })
  restriction: ChannelRestrictionType;

  @Column({ type: 'timestamptz' })
  end_date: Date;
}
