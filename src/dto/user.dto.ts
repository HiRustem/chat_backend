import { IsArray, IsInt, IsNumber, IsString } from "class-validator"

export class UserDto {
    @IsString()
    username: string;

    @IsString()
    password: string;
}

export class AllInfoUserDto {
    @IsString()
    username: string;

    @IsNumber()
    key: string;
}