import { CreateMeetingDto } from "../dto/create-Meeting.dto";
import { Response } from "express";
export interface MeetingServiceInterface {
    createMeeting(createMeetingDto: CreateMeetingDto)
    getMeetingList();
    getToken();
}