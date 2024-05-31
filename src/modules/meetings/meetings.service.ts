import { Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-Meeting.dto';
import { MeetingAdapterFactory } from './meetingadapter';

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
            return e.message;
        }
    }
}
