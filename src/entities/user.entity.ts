import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ unique: true })
  nickname: string;

  @Column({ select: false })
  twofa_enabled: boolean;

  @Column({ select: false })
  login42: string;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];

  @Column()
  avatar: string;

  @Column()
  wins: number;

  @Column()
  losses: number;
}
