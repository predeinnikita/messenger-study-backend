import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { ChatEntity } from './chat.entity';
import { UserEntity } from './user.entity';

@Entity()
export class MessageEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  date: Date;

  @ManyToOne(() => ChatEntity, (chat) => chat.messages, { cascade: ['insert', 'update'] })
  chat: ChatEntity;

  @ManyToOne(() => UserEntity, { cascade: ['insert', 'update'] })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, { cascade: ['insert', 'update'] })
  recipient: UserEntity;
}