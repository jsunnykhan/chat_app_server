import { Password } from "src/authenticate/entities/password.entity";
import { StatusEntity } from "src/friends/entities/status.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class CommonColum {
  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @Column({ type: "uuid", nullable: true })
  last_update: string;

  @Generated("uuid")
  @Column({ type: "uuid" })
  uuid: string;
}
@Entity({ name: "users" })
export class UserEntity extends CommonColum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  provider: string;

  @Column({ nullable: true })
  refresh: string;

  @OneToOne(() => Password, (password) => password.user, { cascade: true })
  @JoinColumn({ name: "password", referencedColumnName: "id" })
  password: Password;

  @ManyToMany((type) => StatusEntity, (connection) => connection.users)
  connections: StatusEntity[];
}
