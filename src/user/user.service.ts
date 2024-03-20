import { Injectable } from "@nestjs/common"
import { DatabaseService } from "../database/database.service"
import { UserDto } from "../dto/user.dto"
import { LoginDto } from "../dto/login.dto"

@Injectable()
export class UserService {
    constructor( private readonly databaseService: DatabaseService ) {}

    async getAllUsersCount() {
        return await this.databaseService.user.count()
    }

    async createUser(userDto: UserDto) {
        return await this.databaseService.user.create({
            data: userDto,
        })
    }

    async deleteUser(userId: number) {
        return await this.databaseService.user.delete({
            where: {
                id: userId,
            }
        })
    }

    async getUserById(userId: number) {
        return await this.databaseService.user.findUnique({
            where: {
                id: userId,
            }
        })
    }

    async login(loginQuery: LoginDto) {
        const { username, password } = loginQuery

        return await this.databaseService.user.findFirstOrThrow({
            where: {
                AND: [
                    { username },
                    { password }
                ]
            }
        })
        .then((result) => {
            return {
                status: true,
                result: result,
            }
        })
        .catch((error) => {
            return {
                status: false,
                result: error,
            }
        })
    }
}