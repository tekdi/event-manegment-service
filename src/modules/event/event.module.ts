import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { HasuraService } from 'src/services/hasura/hasura.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AxiosRequest } from 'src/common/middleware/axios.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event
    ])
  ],
  controllers: [EventController],
  providers: [EventService, HasuraService, ConfigService, AxiosRequest],
})
export class EventModule { }
