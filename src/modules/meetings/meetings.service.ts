import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-Meeting.dto';
import { MeetingAdapterFactory } from './meetingadapter';
import { Response } from 'express';
import APIResponse from 'src/common/utils/response';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MeetingsService {
    private zoom_url: string
    private zoom_auth_url: string;
    private account_id: string;
    private client_id: string;
    private secret_token: string
    constructor(private readonly adapterFactory: MeetingAdapterFactory, private readonly configService: ConfigService) {
        this.zoom_url = this.configService.get('ZOOM_URL')
        this.zoom_auth_url = this.configService.get('ZOOM_AUTH_URL')
        this.account_id = this.configService.get('ZOOM_ACCOUNT_ID')
        this.client_id = this.configService.get('ZOOM_CLIENT_ID')
        this.secret_token = this.configService.get('ZOOM_SECRET_TOKEN')
    }


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

    async getOnlineProvide(response: Response) {
        const apiId = 'api.onlineProvide.get';
        const onlineProviders = [];
        if (this.zoom_url && this.zoom_auth_url && this.account_id && this.client_id && this.secret_token) {
            onlineProviders.push('zoom')
        }
        // if (this.GOOGLE_MEET_API_KEY && this.GOOGLE_MEET_CLIENT_ID && this.GOOGLE_MEET_CLIENT_SECRET && this.GOOGLE_MEET_REDIRECT_URL) {
        //     onlineProviders.push('googleMeet'); 
        // }
        if (onlineProviders.length === 0) {
            return APIResponse.error(response, apiId, 'Not Found', 'provide not found', HttpStatus.NOT_FOUND)
        }
        return APIResponse.success(response, apiId, onlineProviders, HttpStatus.OK, 'online Provide list fetched succesfully')
    }
}
