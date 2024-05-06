import { Module } from '@nestjs/common';
import { AttendeesController } from './attendees.controller';
import { AttendeesService } from './attendees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { EventAttendees } from './entity/attendees.entity';
import { EventService } from '../event/event.service';
import { Events } from '../event/entities/event.entity';
import { CohortMember } from '../event/entities/CohortMembers.entity';
import { Cohort } from '../event/entities/Cohort.entity';
import { Users } from '../event/entities/Users.entity';
import { LoggerService } from 'src/common/logger/logger.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EventAttendees,
      Events,
      CohortMember,
      Cohort,
      Users
    ])
  ],
  controllers: [AttendeesController],
  providers: [AttendeesService, ConfigService, EventService, LoggerService]
})
export class AttendeesModule { }
