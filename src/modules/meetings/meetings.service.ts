import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-Meeting.dto';
import { MeetingAdapterFactory } from './meetingadapter';
import { Response } from 'express';
import APIResponse from 'src/common/utils/response';
@Injectable()
export class MeetingsService {
    constructor(private readonly adapterFactory: MeetingAdapterFactory) { }

    async createMeeting(createMeetingDto: CreateMeetingDto) {
        try {
            const meetingAdapter = this.adapterFactory.getAdapter(createMeetingDto.meetingType)
            const result = await meetingAdapter.createMeeting(createMeetingDto)
            return result;
        }
        catch (e) {
            throw new Error(e.message);
        }
    }

    async getMeetingList(meetingName, response: Response) {
        const apiId = 'api.get.meeting'
        try {
            const meetingType = this.adapterFactory.getAdapter(meetingName);
            const result = await meetingType.getMeetingList();
            return APIResponse.success(response, apiId, result, HttpStatus.OK, 'Meeting list fetched succesfully')
        }
        catch (e) {
            const errorMessage = e.message || 'Internal server error';
            return APIResponse.error(response, apiId, "Internal Server Error", errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
