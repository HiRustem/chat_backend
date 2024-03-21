import { Injectable } from "@nestjs/common"
import { DatabaseService } from "../database/database.service"
import { AllInfoUserDto, SaveUserValueDto, UserDto } from "../dto/user.dto"
import { LoginDto } from "../dto/login.dto"

@Injectable()
export class UserService {
    constructor( private readonly databaseService: DatabaseService ) {}

    async getAllUsersCount() {
        return await this.databaseService.user.count()
    }

    async getAllUserInfo(allInfoUser: AllInfoUserDto) {
        const { username, key } = allInfoUser

        const intKey = parseInt(key)

        return await this.databaseService.user.findFirstOrThrow({
            where: {
                AND: [
                    { username },
                    { key: intKey }
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

    async createUser(userDto: UserDto) {
        const { username, password } = userDto

        const key = Math.floor(Math.random() * 100000000)

        const newUserObject = {
            username,
            password,
            name: username,
            avatar: '',
            chats: [],
            key,
        }

        return await this.databaseService.user.create({
            data: newUserObject,
        })
        .then(result => {
            return result
        })
        .catch(error => {
            return error
        })
    }

    async deleteUser(userId: number) {
        return await this.databaseService.user.delete({
            where: {
                id: userId,
            }
        })
        .then(result => {
            return result
        })
        .catch(error => {
            return error
        })
    }

    async getUserById(userId: number) {
        return await this.databaseService.user.findUnique({
            where: {
                id: userId,
            }
        })
        .then(result => {
            return result
        })
        .catch(error => {
            return error
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

    async saveUserValue(saveUserValue: SaveUserValueDto) {
        const { username, valueName, value } = saveUserValue

        return await this.databaseService.user.update({
            where: {
                username,
            },

            data: {
                [valueName]: value,
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