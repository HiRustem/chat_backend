import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { MessageService } from './message.service'
import { MessageController } from './message.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
