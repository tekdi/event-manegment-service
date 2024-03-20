import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Event } from './entities/event.entity';
import { Response, query, response } from 'express';
import APIResponse from 'src/common/utils/response';
import { SearchFilterDto } from './dto/search-event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRespository: Repository<Event>
  ) { }
  async createEvent(createEventDto: CreateEventDto, response: Response): Promise<Response> {
    const apiId = 'api.create.event';
    try {
      const created = await this.eventRespository.save(createEventDto);
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

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
