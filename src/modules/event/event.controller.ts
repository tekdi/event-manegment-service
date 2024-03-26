import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, Res, ValidationPipe, BadRequestException } from '@nestjs/common';
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { SearchFilterDto } from './dto/search-event.dto';
import { EventValidationPipe } from 'src/common/pipes/event-validation.pipe';

@Controller('event/v1')
@ApiTags('Create Event')
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @Post('/create')
  @ApiBody({ type: CreateEventDto })
  @UsePipes(new EventValidationPipe(), new ValidationPipe({ transform: true }))
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
    description: 'Searched',
    status: 200
  })
  async findAll(@Res() response: Response, @Body() requestBody: SearchFilterDto) {
    return this.eventService.getEvents(response, requestBody);
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Get event details by id',
    status: 200
  })
  findOne(@Param('id') id: string, @Res() response: Response) {
    return this.eventService.getEventByID(id, response);
  }

  @Patch('/:id')
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @UsePipes(new ValidationPipe({ transform: true }))
  updateEvent(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Res() response: Response) {
    if (!updateEventDto || Object.keys(updateEventDto).length === 0) {
      throw new BadRequestException('Please do not pass empty body')
    }
    return this.eventService.updateEvent(id, updateEventDto, response);
  }

  @Delete('/:id')
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  deleteEvent(@Param('id') id: string, @Res() response: Response) {
    return this.eventService.deleteEvent(id, response);
  }
}
