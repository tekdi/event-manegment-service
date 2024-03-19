import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Res, ValidationPipe } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

@Controller('event')
@ApiTags('Create Event')
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @Post('/createEvent')
  @ApiBody({ type: CreateEventDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiCreatedResponse({
    description: 'Created Event',
  })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @ApiInternalServerErrorResponse({ description: 'Server Error.' })
  async create(@Body() createEventDto: CreateEventDto, @Res() response: Response,) {
    return this.eventService.createEvent(createEventDto, response);
  }


  @Get('/getAllEvents')
  async findAll() {
    return this.eventService.getEvents();
  }

  @Get('getEventById/:id')
  findOne(@Param('id') id: string) {
    return this.eventService.getEventByID(id);
  }

  @Patch('/updateEvent/:eventId')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Delete('deleteEvent/:eventId')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
