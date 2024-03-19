import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { HasuraService } from 'src/services/hasura/hasura.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Event } from './entities/event.entity';
import { Response, response } from 'express';
import APIResponse from 'src/common/utils/response';

@Injectable()
export class EventService {
  constructor(private readonly hasuraService: HasuraService,
    @InjectRepository(Event)
    private readonly eventRespository: Repository<Event>
  ) { }
  async createEvent(createEventDto: CreateEventDto, response: Response): Promise<Response> {
    const apiId = 'api.create.event';
    try {
      const created = await this.eventRespository.save(createEventDto);
      return response
        .status(HttpStatus.CREATED)
        .send(APIResponse.success(apiId, created, 'OK'));
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

  async getEvents() {
    let getData = await this.hasuraService.getEventDetails()
    return getData;
  }

  async getEventByID(id) {
    let data = await this.hasuraService.getEventDetailById(id);
    return data;
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
