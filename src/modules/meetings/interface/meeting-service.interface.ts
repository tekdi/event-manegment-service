import { CreateMeetingDto } from "../dto/create-Meeting.dto";
export interface MeetingServiceInterface {
    createMeeting(createMeetingDto: CreateMeetingDto)
    getMeetingList();
    getToken();
}