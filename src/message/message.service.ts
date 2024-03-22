import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service'
import { DeleteMessageDto, MessageDto } from '../dto/message.dto'

@Injectable()
export class MessageService {
  constructor( private readonly databaseService: DatabaseService ) {}

  async sendMessage(messageDto: MessageDto) {
    const { chatId, message } = messageDto

    const messages = await this.databaseService.chat.findUnique({
      where: {
        id: chatId,
      }
    })
    .then(result => { return result.messages })
    .catch(error => { return error })

    if (Array.isArray(messages)) {
      messages.push(message)

      return await this.databaseService.chat.update({
        where: {
          id: chatId,
        },
  
        data: {
          messages,
        },
      })
    } 

    return messages
  }

  async deleteMessage(deleteMessageDto: DeleteMessageDto) {
    const { chatId, messageId } = deleteMessageDto

    const messages = await this.databaseService.chat.findUnique({
      where: {
        id: parseInt(chatId),
      }
    })
    .then(result => { return result.messages })
    .catch(error => { return error })

    if (Array.isArray(messages)) {
      const newArray = messages.filter(message => message.id !== parseInt(messageId))

      return await this.databaseService.chat.update({
        where: {
          id: parseInt(chatId),
        },

        data: {
          messages: newArray,
        }
      })
      .then(result => { return result.messages })
    }

    return messages
  }

  async getAllMessages(chatId: number) {
    return this.databaseService.chat.findUnique({
      where: {
        id: chatId,
      }
    })
    .then(result => { return result.messages })
    .catch(error => { return error })
  }
}