import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common"
import { UserService } from "./user.service"
import { AllInfoUserDto, UserDto } from "../dto/user.dto"
import { LoginDto } from "../dto/login.dto"

@Controller('user')
export class UserController {
    constructor( private readonly userService: UserService ) {}

    @Get('get/:id')
    async getUser(@Param('id', ParseIntPipe) userId: number) {
        return await this.userService.getUserById(userId)
    }

    @Get('chats')
    async getAllUserInfo(@Query() allInfoUser: AllInfoUserDto) {
        return await this.userService.getAllUserInfo(allInfoUser)
    }

    @Get('getAllCount')
    async getAllUsersCount() {
        return await this.userService.getAllUsersCount()
    }

    @UsePipes(new ValidationPipe())
    @Post('register')
    async createUser(@Body() userDto: UserDto) {
        return await this.userService.createUser(userDto)
    }

    @Delete('delete/:id')
    async deleteUser(@Param('id', ParseIntPipe) userId: number) {
        return await this.userService.deleteUser(userId)
    }

    @Get('login')
    async login(@Query() loginQuery: LoginDto) {
        return await this.userService.login(loginQuery)
    }
}