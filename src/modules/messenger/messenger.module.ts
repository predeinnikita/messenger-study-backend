import { Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MessengerService],
  exports: [MessengerService],
})
export class MessengerModule {}
