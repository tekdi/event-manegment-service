import { Injectable } from "@nestjs/common";
import { GoogleMeetingAdapter } from "./adapter/googleMeet.adapter";
import { ZoomMeetingAdapter } from "./adapter/zoom.adapter";
import { MeetingServiceInterface } from "./interface/meeting-service.interface";

@Injectable()
export class MeetingAdapterFactory {
    constructor(
        private readonly zoomMeetingAdapter: ZoomMeetingAdapter,
        private readonly googleMeetingAdapter: GoogleMeetingAdapter
    ) { }

    getAdapter(meetingType: string): MeetingServiceInterface {
        console.log(meetingType, "adaptor"); // Log the meeting type for debugging

        switch (meetingType) {
            case 'zoom':
                return this.zoomMeetingAdapter;
            case 'googleMeet':
                return this.googleMeetingAdapter;
            default:
                throw new Error('Invalid Meeting type.');
        }
    }
}
