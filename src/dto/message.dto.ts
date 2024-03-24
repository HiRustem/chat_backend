import { JsonObject } from '@prisma/client/runtime/library'
import { IsNumber, IsString } from 'class-validator'

export class MessageDto {
  @IsNumber()
  chatId: number;

  message: JsonObject;
}

export class DeleteMessageDto {
  @IsString()
  chatId: string;

  @IsString()
  messageId: string;
}

export class EditMessageDto {
  @IsString()
  chatId: string;

  @IsString()
  messageId: string;

  @IsString()
  content: string;
}