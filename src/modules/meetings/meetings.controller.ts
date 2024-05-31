import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MeetingAdapterFactory } from './meetingadapter';
import { CreateMeetingDto } from './dto/create-Meeting.dto';
import { ApiBody } from '@nestjs/swagger';
import { MeetingsService } from './meetings.service';


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


    @Get('/:meetingName')
    async getMeetingList(@Param('meetingName') meetingName: string) {
        const meetingType = this.adapterFactory.getAdapter(meetingName)
        const result = await meetingType.getMeetingList();
        return result
    }
}
