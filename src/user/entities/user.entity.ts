import { Password } from 'src/authenticate/entities/password.entity';
import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CommonColum {
  @Column({ type: 'date', nullable: false, default: new Date() })
  created_at: string;
  @Column({ type: 'date', nullable: true })
  updated_at: string;
  @Column({ type: 'uuid', nullable: true })
  last_update: string;
}
@Entity()
export class User extends CommonColum {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated('uuid')
  @Column({ type: 'uuid' })
  uuid: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  provider: string;

  @Column({ nullable: true })
  refresh: string;

  @OneToOne(() => Password, (password) => password.user, { cascade: true })
  @JoinColumn()
  password: Password;
}
