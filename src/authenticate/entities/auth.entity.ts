import { CommonEntity } from "src/database/commonEntity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { PasswordEntity } from "./password.entity";
import { UserEntity } from "src/user/entities/user.entity";

@Entity({ name: "auth" })
export class AuthEntity extends CommonEntity<AuthEntity> {
  @Column({ nullable: true })
  refresh: string;

  @Column({ nullable: true })
  provider: string;

  @OneToOne((type) => PasswordEntity, (password) => password.auth, { cascade: true })
  @JoinColumn()
  password: PasswordEntity;

  @OneToOne((type) => UserEntity, (user) => user.auth, { cascade: true })
  @JoinColumn()
  user: UserEntity;
}
