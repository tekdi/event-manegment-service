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

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Events)
    private readonly eventRespository: Repository<Events>,
    private readonly attendeesService: AttendeesService
  ) { }
  async createEvent(createEventDto: CreateEventDto, response: Response): Promise<Response> {
    const apiId = 'api.create.event';
    try {
      const created = await this.eventRespository.save(createEventDto);
      if (created.eventID && createEventDto.isRestricted === true) {
        const attendeedDto: EventAttendeesDTO = {
          eventId: created.eventID,
          enrolledBy: '',
          status: 'published',
          isAttended: false
        }
        const userId = 'e9fec05a-d6ab-44be-bfa4-eaeef2ef8fe9';
        const userIds = createEventDto?.params;
        await this.attendeesService.createAttendees(attendeedDto, response, userId, userIds);
      }
      return response
        .status(HttpStatus.CREATED)
        .send(APIResponse.success(apiId, { event_ID: created.eventID }, 'OK'));
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

  findOne(id: number) {
    return `This action returns a #${id} event`;
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
}
