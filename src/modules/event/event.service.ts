import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Events } from './entities/event.entity';
import { Response } from 'express';
import APIResponse from 'src/common/utils/response';
import { SearchFilterDto } from './dto/search-event.dto';
import { EventValidationPipe } from 'src/common/pipes/event-validation.pipe';
import { AttendeesService } from '../attendees/attendees.service';
import { EventAttendeesDTO } from '../attendees/dto/EventAttendance.dto';
import { CohortMember } from './entities/CohortMembers.entity';
import { Cohort } from './entities/Cohort.entity';
import { Users } from './entities/Users.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Events)
    private readonly eventRespository: Repository<Events>,
    @InjectRepository(CohortMember)
    private readonly cohortMemberRepo: Repository<CohortMember>,
    @InjectRepository(Cohort)
    private readonly cohortRepo: Repository<Cohort>,
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    private readonly attendeesService: AttendeesService
  ) { }
  async createEvent(createEventDto: CreateEventDto, userId: string, response: Response): Promise<Response> {
    const apiId = 'api.create.event';
    try {
      // checkl if isRistricted true then check cohorts id or user id present in db or not
      if (createEventDto.isRestricted === true) {
        if (createEventDto.params.userIds) {
          await this.validateUserIds(createEventDto.params.userIds);
        }
        else if (createEventDto.params.cohortIds) {
          await this.validateCohortIds(createEventDto.params.cohortIds)
        }
      }
      const created = await this.eventRespository.save(createEventDto);
      // Create attendees if isRsetricted true 
      if (created.eventID && createEventDto.isRestricted === true) {
        await this.CreateAttendeedforRestrictedEvent(createEventDto, created, userId, response)
      }
      return response
        .status(HttpStatus.CREATED)
        .send(APIResponse.success(apiId, { event_ID: created.eventID }, 'CREATED'));
    }
    catch (e) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(APIResponse.error(
          apiId,
          'Something went wrong in event creation',
          JSON.stringify(e),
          'INTERNAL_SERVER_ERROR',
        ))
    }
  }

  async getEvents(response: Response, requestBody: SearchFilterDto) {
    const apiId = 'api.Search.Event'
    try {
      let finalquery = `SELECT * FROM "Events"`;
      const { filters } = requestBody;
      if (filters && Object.keys(filters).length > 0) {
        finalquery = await this.createSearchQuery(filters, finalquery);
      }
      const result = await this.eventRespository.query(finalquery);
      if (result.length === 0) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .send(
            APIResponse.error(
              apiId,
              `No event found`,
              'No records found.',
              'NOT_FOUND',
            ),
          );
      }
      return response
        .status(HttpStatus.OK)
        .send(APIResponse.success(apiId, result, "OK"));
    }
    catch (e) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(APIResponse.error(
          apiId,
          'Something went wrong to search event',
          JSON.stringify(e),
          'INTERNAL_SERVER_ERROR',
        ))
    }
  }

  async getEventByID(eventID: string, response: Response) {
    const apiId = 'api.get.event.byId'
    try {
      const getEventById = await this.eventRespository.findOne({ where: { eventID } });
      if (!getEventById) {
        return response
          .status(HttpStatus.NOT_FOUND)
          .send(
            APIResponse.error(
              apiId,
              `No event found for: ${eventID}`,
              'No records found.',
              'NOT_FOUND',
            ),
          );
      }
      return response
        .status(HttpStatus.OK)
        .send(APIResponse.success(apiId, getEventById, 'OK'))

    }
    catch (e) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(APIResponse.error(
          apiId,
          'Something went wrong to get event by id',
          `Failure Retrieving event. Error is: ${e}`,
          'INTERNAL_SERVER_ERROR',
        ))
    }
  }

  async updateEvent(eventID: string, updateEventDto: UpdateEventDto, response: Response) {
    const apiId = 'api.update.event';
    try {
      const event = await this.eventRespository.findOne({ where: { eventID } })
      if (!event) {
        return response.status(HttpStatus.NOT_FOUND).send(
          APIResponse.error(
            apiId,
            `No event found for: ${eventID}`,
            'records not found.',
            'NOT_FOUND',
          ),
        );
      }
      Object.assign(event, updateEventDto);
      new EventValidationPipe().transform(event);
      const updated_result = await this.eventRespository.save(event);
      if (!updated_result) {
        throw new BadRequestException('Event update failed');
      }
      return response
        .status(HttpStatus.CREATED)
        .send(APIResponse.success(apiId, { id: eventID, status: 'updated Successfully' }, 'OK'))
    }
    catch (e) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(APIResponse.error(
          apiId,
          'Something went wrong to update the event',
          `Failure to update event Error is: ${e}`,
          'INTERNAL_SERVER_ERROR',
        ))
    }
  }

  async deleteEvent(eventID: string, response: Response) {
    const apiId = 'api.delete.event'
    try {
      const event_id = await this.eventRespository.findOne({ where: { eventID } })
      if (!event_id) {
        return response.status(HttpStatus.NOT_FOUND).send(
          APIResponse.error(
            apiId,
            `No event id found: ${eventID}`,
            'records not found.',
            'NOT_FOUND',
          ),
        );
      }
      const deletedEvent = await this.eventRespository.delete({ eventID });
      if (deletedEvent.affected !== 1) {
        throw new BadRequestException('Event not deleted');
      }
      return response
        .status(HttpStatus.OK)
        .send(
          APIResponse.success(
            apiId,
            { status: `Event with ID ${eventID} deleted successfully.` },
            'OK',
          ),
        );
    }
    catch (e) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(APIResponse.error(
          apiId,
          'Something went wrong to get event by id',
          `Failure Retrieving event. Error is: ${e}`,
          'INTERNAL_SERVER_ERROR',
        ))
    }
  }

  async createSearchQuery(filters, finalquery) {
    let whereClause = false;
    if (filters.title && filters.title !== "") {
      finalquery += ` WHERE "title" LIKE '%${filters.title}%'`;
      whereClause = true;
    }
    if (filters.eventType && filters.eventType.length > 0) {
      let eventTypeConditions = [];
      filters.eventType.forEach((eventType) => {
        eventTypeConditions.push(`"eventType" = '${eventType}'`);
      });
      finalquery += whereClause ? ` AND (${eventTypeConditions.join(' OR ')})` : ` WHERE (${eventTypeConditions.join(' OR ')})`;
      whereClause = true;
    }
    if (filters.status && filters.status.length > 0) {
      let statusConditions = [];
      filters.status.forEach((status) => {
        statusConditions.push(`"status" = '${status}'`);
      });
      finalquery += whereClause ? ` AND (${statusConditions.join(' OR ')})` : ` WHERE (${statusConditions.join(' OR ')})`;
      whereClause = true;
    }
    if (filters.startDate && filters.endDate) {
      finalquery += whereClause ? ` AND "startDatetime" >= TIMESTAMP '${filters.startDate}' AND "endDatetime" <= '${filters.endDate}'` : ` WHERE "startDatetime" >= '${filters.startDate}' AND "endDatetime" <= '${filters.endDate}'`;
    } else if (filters.startDate) {
      finalquery += whereClause ? ` AND "startDatetime" >= TIMESTAMP '${filters.startDate}'` : ` WHERE "startDatetime" >= TIMESTAMP '${filters.startDate}'`;
    } else if (filters.endDate) {
      finalquery += whereClause ? ` AND "endDatetime" <=  TIMESTAMP '${filters.endDate}'` : ` WHERE "endDatetime" TIMESTAMP <= '${filters.endDate}'`;
    }
    if (filters.createdBy && filters.createdBy !== "") {
      finalquery += whereClause ? ` AND "createdBy" LIKE '%${filters.createdBy}%'` : ` WHERE "createdBy" = '${filters.createdBy}'`;
    }
    return finalquery;
  }

  // check userids present in user table or not
  async validateUserIds(userIds: string[]) {
    const queryBuilder = this.usersRepo.createQueryBuilder('Users')
      .select('Users.userId', 'userId')
      .where('Users.userId IN (:...userIds)', { userIds });
    const users = await queryBuilder.getRawMany();
    const existingUserIds = users.map(user => user.userId);
    const missingUserIds = userIds.filter(userId => !existingUserIds.includes(userId));
    if (missingUserIds.length > 0) {
      throw new BadRequestException(`The following user IDs are not present: ${missingUserIds.join(', ')}`);
    }
  }

  // check cohortids present in cohort table or not
  async validateCohortIds(cohortIds: string[]) {
    const queryBuilder = this.cohortRepo.createQueryBuilder('Cohort')
      .select('Cohort.cohortId', 'cohortId')
      .where('Cohort.cohortId IN (:...cohortIds)', { cohortIds });
    const cohorts = await queryBuilder.getRawMany();
    const existingCohortIds = cohorts.map(cohort => cohort.cohortId);
    const missingCohortIds = cohortIds.filter(cohortId => !existingCohortIds.includes(cohortId));
    if (missingCohortIds.length > 0) {
      throw new BadRequestException(`The following cohort IDs are not present: ${missingCohortIds.join(', ')}`);
    }
  }

  async CreateAttendeedforRestrictedEvent(createEventDto, created, userId, response) {
    const attendeedDto: EventAttendeesDTO = {
      eventId: created.eventID,
      enrolledBy: userId,
      status: 'published'
    }
    const cohortsIdsOruserIds = createEventDto?.params; //{ cohortIds: [ 'eff008a8-2573-466d-b877-fddf6a4fc13e' ] }
    const cohortIds = cohortsIdsOruserIds.cohortIds || [];
    const userIds = cohortsIdsOruserIds.userIds || [];
    if (cohortIds?.length > 0) {
      const userIds: string[] = [];
      const queryBuilder = this.cohortMemberRepo.createQueryBuilder('CohortMembers')
        .select('CohortMembers.userId', 'userId')
        .where('CohortMembers.cohortId IN (:...cohortIds)', { cohortIds });
      const cohortMembers = await queryBuilder.getRawMany();
      for (const member of cohortMembers) {
        userIds.push(member.userId);
      }
      if (userIds.length > 0) {
        await this.attendeesService.createAttendees(attendeedDto, response, userId, userIds);
      }
    }
    else if (userIds?.length > 0) {
      await this.attendeesService.createAttendees(attendeedDto, response, userId, userIds);
    }
  }

}
