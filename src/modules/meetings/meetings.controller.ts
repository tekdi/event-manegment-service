import { BadRequestException, Body, Controller, Get, Param, Post, Res, UseFilters } from '@nestjs/common';
import { MeetingAdapterFactory } from './meetingadapter';
import { CreateMeetingDto } from './dto/create-Meeting.dto';
import { ApiBody } from '@nestjs/swagger';
import { MeetingsService } from './meetings.service';
import { AllExceptionsFilter } from 'src/common/filters/exception.filter';
import { APIID } from 'src/common/utils/api-id.config';
import { Response, response } from 'express';


@Controller('meetings/v1')
export class MeetingsController {
    constructor(
        private readonly adapterFactory: MeetingAdapterFactory,
        private readonly meetingsService: MeetingsService
    ) { }

    @Post('/create')
    @ApiBody({
        type: CreateMeetingDto
    })
    async createMeetings(@Body() createMeetingDto: CreateMeetingDto) {
        return await this.meetingsService.createMeeting(createMeetingDto);
    }


    @Get('onlineProvider')
    async getOnlineProvider(@Res() response: Response) {
        return await this.meetingsService.getOnlineProvide(response)
    }

    @UseFilters(new AllExceptionsFilter(APIID.MEETING_GET))
    @Get('/:meetingName')
    async getMeetingList(@Param('meetingName') meetingName: string, @Res() response: Response) {
        return await this.meetingsService.getMeetingList(meetingName, response);
    }



}
