import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  restriction: string;

  @Column()
  password: string;
}
