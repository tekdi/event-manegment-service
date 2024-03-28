import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { EventAttendeesDTO } from './dto/EventAttendance.dto';
import { AttendeesService } from './attendees.service';
import { Response } from 'express';
import { UUID } from 'crypto';

@Controller('attendees/v1')
@ApiTags('Event-Attendance')
export class AttendeesController {

    constructor(private readonly attendeesService: AttendeesService) { }

    @Post('/create')
    @ApiBadRequestResponse({ description: 'Invalid request' })
    @ApiBody({ type: EventAttendeesDTO })
    @ApiCreatedResponse({
        description: 'Created Event'
    })
    async create(@Body() eventAttendeesDTO: EventAttendeesDTO, @Res() response: Response) {
        const userId = 'e9fec05a-d6ab-44be-bfa4-eaeef2ef8fe9';
        return this.attendeesService.createAttendees(eventAttendeesDTO, response, userId);
    }

    @Get()
    async findAll() {
        return true;
    }

    @Get('/:id')
    findOne(@Param('id', ParseUUIDPipe) id: string, @Res() response: Response) {
        return this.attendeesService.getAttendees(id, response);
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
