import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Password {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  salt: string;
  @Column({ nullable: true })
  hash: string;
  @Column({ nullable: true })
  algo: string;
  @OneToOne(() => User, (user) => user.password)
  user_id: User;
}
