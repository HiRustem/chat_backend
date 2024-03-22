import { Body, Controller, Delete, Param, ParseIntPipe, Post, Query } from '@nestjs/common'
import { MessageService } from './message.service'
import { DeleteMessageDto, MessageDto } from '../dto/message.dto'

@Controller('message')
export class MessageController {
  constructor( private readonly messageService: MessageService ) {}

  @Post('send')
  async send(@Body() messageDto: MessageDto) {
    return await this.messageService.sendMessage(messageDto)
  }

  @Delete('delete')
  async delete(@Query() deleteMessageDto: DeleteMessageDto) {
    return await this.messageService.deleteMessage(deleteMessageDto)
  }
}