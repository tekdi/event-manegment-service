import { Injectable } from "@nestjs/common";
import { MeetingServiceInterface } from '../interface/meeting-service.interface'
import { CreateMeetingDto } from "../dto/create-Meeting.dto";
import axios from "axios";
import { ConfigService } from "@nestjs/config";

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

    async getMeetingList() {
        try {
            const token = await this.getToken();
            if (token) {
                const resp = await axios({
                    method: "get",
                    url: this.zoom_url,
                    headers: {
                        Authorization: "Bearer " + `${token} `,
                        "Content-Type": "application/json",
                    },
                });
                const meetings = resp.data.meetings;
                const newArray = meetings.map((obj) =>
                    ["id", "topic"].reduce((newObj, key) => {
                        newObj[key] = obj[key];
                        return newObj;
                    }, {})
                );

                return newArray;
            }
        }
        catch (err) {
            if (err.status == undefined) {
                console.log("Error : ", err);
            }
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
            console.error(e.message, "error");
        }
    }
}











// require("dotenv").config();
// const axios = require("axios");
// const btoa = require("btoa");
// const thirdPartyAPICall = () => {
//     try {

//         // Make API Call Here 
//         return "Third Party API Call";
//     } catch (err) {
//         // Handle Error Here
//         console.error(err);
//     }
// };

// const getAccessToken = async () => {
//     try {
//         base_64 = btoa("bgiOqbEZSMKHgSi0oRqlgQ" + ":" + "hPeg8wNWO5gPH33WU3aXQpY1V3KOJsnS");

//         const resp = await axios({
//             method: "POST",
//             url:
//                 "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=GCqoO7xPQ1-JRuRsPPZO8A",
//             headers: {
//                 Authorization: "Basic " + `${base_64} `,
//             },
//         });

//         return resp.data.access_token;
//     } catch (err) {
//         // Handle Error Here
//         console.error(err);
//     }
// };

// const listZoomMeetings = async () => {
//     try {
//         const resp = await axios({
//             method: "get",
//             url: "https://api.zoom.us/v2/users/me/meetings",
//             headers: {
//                 Authorization: "Bearer " + `${await getAccessToken()} `,
//                 "Content-Type": "application/json",
//             },
//         });
//         const meetings = resp.data.meetings;

//         const newArray = meetings.map((obj) =>
//             ["id", "topic"].reduce((newObj, key) => {
//                 newObj[key] = obj[key];
//                 return newObj;
//             }, {})
//         );

//         return newArray;
//     } catch (err) {
//         if (err.status == undefined) {
//             console.log("Error : ", err);
//         }
//     }
// };

// function generateOTP() {
//     var digits = "0123456789";
//     let OTP = "";
//     for (let i = 0; i < 6; i++) {
//         OTP += digits[Math.floor(Math.random() * 10)];
//     }
//     return OTP;
// }


// module.exports = {
//     createZoomMeeting,
//     listZoomMeetings,
//     thirdPartyAPICall,
// };