import { Module } from '@nestjs/common';
import { AttendeesController } from './attendees.controller';
import { AttendeesService } from './attendees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { EventAttendees } from './entity/attendees.entity';



@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventAttendees
    ])
  ],
  controllers: [AttendeesController],
  providers: [AttendeesService, ConfigService]
})
export class AttendeesModule { }
