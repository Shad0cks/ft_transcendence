import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  twofa_enabled: boolean;

  @Column({ unique: true })
  nickname: string;

  @Column({ select: false })
  login42: string;

  @Column()
  avatar: string;

  @Column()
  wins: number;

  @Column()
  losses: number;
}
