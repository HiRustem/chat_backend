import { IsArray, IsString } from "class-validator"

export class UserDto {
    
    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsString()
    name: string;

    @IsString()
    avatar: string;

    @IsArray()
    chats: string[];
}