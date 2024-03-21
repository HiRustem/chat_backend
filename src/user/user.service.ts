import { Injectable } from "@nestjs/common"
import { DatabaseService } from "../database/database.service"
import { AddNewChatDto, AllInfoUserDto, SaveUserValueDto, UserDto } from "../dto/user.dto"
import { LoginDto } from "../dto/login.dto"
import { Prisma, PrismaClient } from "@prisma/client"

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

    async findUserByUsername(username: string) {
        return await this.databaseService.$queryRaw(
            Prisma.sql`SELECT * FROM "User" WHERE username LIKE ${'%' + username + '%'}`
        )
        .then(result => { return result })
        .catch(error => { return error })
    }

    async getChat(chatId: number) {
        return await this.databaseService.chat.findUniqueOrThrow({
            where: {
                id: chatId,
            }
        })
        .then(result => { return result })
        .catch(() => { return {} })
    }

    async createNewChat(addNewChatDto: AddNewChatDto) {
        const { firstUsername, secondUsername } = addNewChatDto

        const firstUser = await this.databaseService.user.findUnique({
            where: {
                username: firstUsername,
            }
        })
        .then(result => { return result })
        .catch(() => { return null })

        const secondUser = await this.databaseService.user.findUnique({
            where: {
                username: secondUsername,
            }
        })
        .then(result => { return result })
        .catch(() => { return null })

        if (firstUser && secondUser) {
            const newChatObject = {
                name: `${firstUser.name} and ${secondUser.name} chat`,
                avatar: '',
                messages: [],
                members: [`${firstUser.id}`, `${secondUser.id}`],
            }

            const newChat = await this.databaseService.chat.create({
                data: newChatObject,
            })
            .then(result => {
                return result
            })

            await this.databaseService.user.update({
                where: {
                    username: firstUsername,
                },
    
                data: {
                    chats: [...firstUser.chats, `${newChat.id}`],
                }
            })

            await this.databaseService.user.update({
                where: {
                    username: secondUsername,
                },
    
                data: {
                    chats: [...secondUser.chats, `${newChat.id}`],
                }
            })

            return newChat
        }
    }

    async deleteChat(chatId: number) {
        const deletedChat = await this.databaseService.chat.delete({
            where: {
                id: chatId,
            }
        })
        .then(result => {
            return result
        })
        .catch(() => {
            return undefined
        })

        if (deletedChat) {
            const members = deletedChat.members

            for (let userId of members) {
                const findUser = await this.databaseService.user.findUnique({
                    where: {
                        id: parseInt(userId)
                    }
                })
                .then(result => { return result })

                const newArray = findUser.chats.filter(chat => parseInt(chat) !== chatId)

                await this.databaseService.user.update({
                    where: {
                        id: parseInt(userId),
                    },

                    data: {
                        chats: newArray,
                    }
                })
            }
        }

        return deletedChat
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

    async clearAllChats(userId: number) {
        return await this.databaseService.user.update({
            where: {
                id: userId,
            },

            data: {
                chats: [],
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