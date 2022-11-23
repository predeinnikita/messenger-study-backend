import { MessageEntity } from "src/entities/message.entity";
import { UserEntity } from "src/entities/user.entity";
import ChatModel from "./chat.model";
import UserModel from "./user.model";

export default class MessageModel {
    public id: number;

    public text: string;
  
    public date: Date;
  
    public chat: ChatModel;
  
    public sender: UserModel;
  
    public recipient: UserModel;

    constructor(message: MessageEntity) {
        this.id = message.id;
        if (message.text) {
            this.text = message.text;
        }
        if (message.date) {
            this.date = message.date;
        }
        if (message.chat) {
            this.chat = new ChatModel(message.chat);
        }
        if (message.sender) {
            this.sender = new UserModel(message.sender);
        }
        if (message.recipient) {
            this.recipient = new UserModel(message.recipient);
        }
    }
}