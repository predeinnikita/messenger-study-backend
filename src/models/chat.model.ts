import { ChatEntity } from "src/entities/chat.entity";
import MessageModel from "./message.model";
import UserModel from "./user.model";

export default class ChatModel {
    public id: number;
  
    public messages: MessageModel[];

    public lastMessage: MessageModel;
  
    public firstUser: UserModel;
  
    public secondUser: UserModel;

    constructor(chat: ChatEntity) {
        this.id = chat.id;
        if (chat.messages) {
            this.messages = chat.messages.map(message => new MessageModel(message));
        }
        if (chat.messages && chat.messages.length > 0) {
            this.lastMessage = this.messages[this.messages.length - 1];
        }
        if (chat.firstUser) {
            this.firstUser = new UserModel(chat.firstUser);
        }
        if (chat.secondUser) {
            this.secondUser = new UserModel(chat.secondUser);
        }
    }
}