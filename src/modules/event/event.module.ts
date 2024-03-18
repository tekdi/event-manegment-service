import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { HasuraService } from 'src/services/hasura/hasura.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AxiosRequest } from 'src/common/middleware/axios.middleware';

@Module({
  controllers: [EventController],
  providers: [EventService,HasuraService,ConfigService,AxiosRequest],
})
export class EventModule {}
