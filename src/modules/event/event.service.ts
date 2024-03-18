import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { HasuraService } from 'src/services/hasura/hasura.service';

@Injectable()
export class EventService {
  constructor (private readonly hasuraService:HasuraService){}
  async createEvent(createEventDto: CreateEventDto) {
    let data = await this.hasuraService.createEventDetails(createEventDto);
    return data;
  }

  async getEvents() {
    let getData = await this.hasuraService.getEventDetails()
    return getData;
  }

  async getEventByID(id){
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
