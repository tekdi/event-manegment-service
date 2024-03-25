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
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { SearchFilterDto } from './dto/search-event.dto';

@Controller('event/v1')
@ApiTags('Create Event')
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @Post('/create')
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

  @Post('/list')
  @ApiBody({ type: SearchFilterDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({
    description: 'Searched ',
    status: 200
  })
  async findAll(@Res() response: Response, @Body() requestBody: SearchFilterDto) {
    return this.eventService.getEvents(response, requestBody);
  }

  @Get('/:id')
  findOne(@Param('id') id: string, @Res() response: Response) {
    return this.eventService.getEventByID(id, response);
  }


  @Patch('/:id')
  @ApiBody({ type: CreateEventDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Res() response: Response) {
    return this.eventService.updateEvent(id, updateEventDto, response);
  }

  @Delete('/:eventId')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
