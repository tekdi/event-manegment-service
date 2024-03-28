import { HttpStatus, Injectable } from '@nestjs/common';
import { EventAttendeesDTO } from './dto/EventAttendance.dto';
import { Response } from 'express';
import APIResponse from 'src/common/utils/response';
import { EventAttendees } from './entity/attendees.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

@Injectable()
export class AttendeesService {

    constructor(
        @InjectRepository(EventAttendees)
        private readonly eventAttendees: Repository<EventAttendees>
    ) { }

    async createAttendees(eventAttendeesDTO: EventAttendeesDTO, response: Response, userId?: string, userIds?: string[]): Promise<Response> {
        const apiId = 'create.event.attendees';
        try {
            if (userIds && Object.keys(userIds).length > 0) {
                const cohortIdsValue = userIds['cohortIds']
                console.log(cohortIdsValue[0]);
                // for (let i = 0; i < cohortIdsValue.length; i++) {
                //     // const result = await this.saveattendessRecord(eventAttendeesDTO, cohortIdsValue[i]);
                //     console.log("yes");
                // }
            } else {
                const result = await this.saveattendessRecord(eventAttendeesDTO, userId);
                return response
                    .status(HttpStatus.CREATED)
                    .send(APIResponse.success(apiId, result.eventAttendeesId, 'Created'))
            }
        }
        catch (e) {
            return response
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send(APIResponse.error(
                    apiId,
                    'Something went wrong',
                    JSON.stringify(e),
                    'INTERNAL_SERVER_ERROR',
                ))
        }
    }
    async saveattendessRecord(eventAttendeesDTO: EventAttendeesDTO, userId) {
        const eventAttend = new EventAttendees();
        eventAttend.userId = userId;
        eventAttend.eventId = eventAttendeesDTO.eventId;
        eventAttend.joinedLeftHistory = {};
        eventAttend.duration = 0;
        eventAttend.isAttended = false;
        eventAttend.status = eventAttendeesDTO.status;
        eventAttend.enrolledAt = new Date();
        eventAttend.enrolledBy = eventAttendeesDTO.enrolledBy;
        eventAttend.updatedAt = new Date();
        const result = await this.eventAttendees.save(eventAttend);
        return result;
    }
}
