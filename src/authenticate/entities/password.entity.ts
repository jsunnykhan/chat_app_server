import { CommonEntity } from "src/database/commonEntity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, OneToOne } from "typeorm";
import { AuthEntity } from "./auth.entity";

@Entity({ name: "password" })
export class PasswordEntity extends CommonEntity<PasswordEntity> {
  @Column()
  salt: string;

  @Column({ nullable: true })
  hash: string;

  @Column({ nullable: true })
  algorithm: string;

  @OneToOne(() => AuthEntity, (auth) => auth.password)
  auth: UserEntity;
}
