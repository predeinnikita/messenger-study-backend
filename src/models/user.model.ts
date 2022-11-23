import { UserEntity } from "src/entities/user.entity";

export default class UserModel {
    public id: number;

    public username: string;

    constructor(user: UserEntity) {
        this.id = user.id;
        if (user.username) {
            this.username = user.username;
        }
    }
}