import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { MessageEntity } from './message.entity';
import { UserEntity } from './user.entity';

@Entity()
export class ChatEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => MessageEntity, (message) => message.chat, { cascade: ['insert', 'update'] })
  messages: MessageEntity[];

  @ManyToOne(() => UserEntity, { cascade: ['insert', 'update'] })
  firstUser: UserEntity;

  @ManyToOne(() => UserEntity, { cascade: ['insert', 'update'] })
  secondUser: UserEntity;
}