import { Module } from '@nestjs/common';
import { MeetingsController } from './meetings.controller';
import { MeetingAdapterFactory } from './meetingadapter';
import { ZoomMeetingAdapter } from './adapter/zoom.adapter';
import { GoogleMeetingAdapter } from './adapter/googleMeet.adapter';
import { MeetingsService } from './meetings.service';


@Module({
  providers: [MeetingAdapterFactory, ZoomMeetingAdapter, GoogleMeetingAdapter, MeetingsService],
  controllers: [MeetingsController]
})
export class MeetingsModule { }
