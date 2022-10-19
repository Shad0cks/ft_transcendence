import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login42: string;

  @Column({ unique: true })
  nickname: string;

  @Column()
  avatar: string;

  @Column()
  wins: number;

  @Column()
  losses: number;
}
