import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import { EventAttendeesDTO } from './dto/EventAttendance.dto';
import { AttendeesService } from './attendees.service';
import { Response, response } from 'express';
import { SearchAttendeesDto } from './dto/searchAttendees.dto';

@Controller('attendees/v1')
@ApiTags('Event-Attendance')
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Post('/create')
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @ApiBody({ type: EventAttendeesDTO })
  @ApiCreatedResponse({
    description: 'Created Event',
  })
  async create(
    @Body() eventAttendeesDTO: EventAttendeesDTO,
    @Res() response: Response,
  ) {
    const userId = '0005b8cb-0c05-4d40-bb35-5be7ca3d229b';
    const userIds = '';
    return this.attendeesService.createAttendees(
      eventAttendeesDTO,
      response,
      userId,
      userIds,
    );
  }

  @Post()
  @ApiOkResponse({ description: 'Get attendees Details' })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @ApiBody({ type: SearchAttendeesDto })
  async searchAttendees(
    @Body() searchAttendeesDto: SearchAttendeesDto,
    @Res() response: Response,
  ) {
    if (
      !searchAttendeesDto ||
      (!searchAttendeesDto.eventId && !searchAttendeesDto.userId)
    ) {
      throw new BadRequestException('Please do not pass empty body');
    }
    if (searchAttendeesDto.eventId && searchAttendeesDto.userId) {
      throw new BadRequestException('Please do not pass both in body');
    }
    return this.attendeesService.getAttendees(searchAttendeesDto, response);
  }

  @Patch('/:id')
  update() {
    return true;
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return true;
  }
}
