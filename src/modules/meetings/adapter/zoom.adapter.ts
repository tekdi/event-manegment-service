import { HttpStatus, Injectable } from "@nestjs/common";
import { MeetingServiceInterface } from '../interface/meeting-service.interface'
import { CreateMeetingDto } from "../dto/create-Meeting.dto";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import APIResponse from "src/common/utils/response";
import { Response } from "express";
@Injectable()
export class ZoomMeetingAdapter implements MeetingServiceInterface {
    private zoom_url: string
    private zoom_auth_url: string;
    private account_id: string;
    private client_id: string;
    private secret_token: string

    constructor(private readonly configService: ConfigService) {
        this.zoom_url = this.configService.get('ZOOM_URL')
        this.zoom_auth_url = this.configService.get('ZOOM_AUTH_URL')
        this.account_id = this.configService.get('ZOOM_ACCOUNT_ID')
        this.client_id = this.configService.get('ZOOM_CLIENT_ID')
        this.secret_token = this.configService.get('ZOOM_SECRET_TOKEN')
    }
    async createMeeting(createMeetingDto: CreateMeetingDto) {
        try {
            const token = await this.getToken();
            if (token) {
                const resp = await axios({
                    method: "post",
                    url: this.zoom_url,
                    headers: {
                        Authorization: "Bearer " + `${token} `,
                        "Content-Type": "application/json",
                    },
                    data: createMeetingDto,
                });
                const { id, password } = resp.data;
                return { id, password }
                // return resp.data;
            }
        }
        catch (err) {
            if (err.status == undefined) {
                console.log("Error : ", err);
            }
            if (err.status === 400) {
                return err;
            }
        }
    }

    async getMeetingList(response: Response) {
        const apiId = 'api.meeting.get'
        try {
            const token = await this.getToken();
            if (!token) {
                throw new Error('Failed to retrieve access token');
            }
            const resp = await axios({
                method: "get",
                url: this.zoom_url,
                headers: {
                    Authorization: "Bearer " + `${token} `,
                    "Content-Type": "application/json",
                },
            });
            const meetings = resp.data.meetings;
            const result = meetings.map((obj) =>
                ["id", "topic"].reduce((newObj, key) => {
                    newObj[key] = obj[key];
                    return newObj;
                }, {})
            );
            return APIResponse.success(response, apiId, result, HttpStatus.OK, 'Meeting list fetched succesfully')
            // return newArray;

        }
        catch (e) {
            const errorMessage = e.message || 'Internal server error';
            return APIResponse.error(response, apiId, "Internal Server Error", errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getToken() {
        try {
            const base64Credentials = btoa(`${this.client_id}` + ":" + `${this.secret_token}`);
            const resp = await axios({
                method: "POST",
                url:
                    `${this.zoom_auth_url}?grant_type=account_credentials&account_id=${this.account_id}`,

                headers: {
                    Authorization: "Basic " + `${base64Credentials} `,
                },
            });
            return resp.data.access_token;
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
}
