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

export class SaveUserValueDto {
    @IsString()
    username: string;

    @IsString()
    valueName: string;

    @IsString()
    value: string;
}