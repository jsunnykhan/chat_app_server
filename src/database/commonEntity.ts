import { Column, CreateDateColumn, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class CommonEntity<T> {
  @PrimaryGeneratedColumn()
  id: number;

  @Generated("uuid")
  @Column({ type: "uuid" })
  uuid: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @Column({ type: "uuid", nullable: true })
  last_update: string;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
