import { HttpStatus, Injectable } from '@nestjs/common';
import { EventAttendeesDTO } from './dto/EventAttendance.dto';
import { Response } from 'express';
import APIResponse from 'src/common/utils/response';
import { EventAttendees } from './entity/attendees.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Events } from '../event/entities/event.entity';
import { SearchAttendeesDto } from './dto/searchAttendees.dto';

@Injectable()
export class AttendeesService {
    constructor(
        @InjectRepository(EventAttendees)
        private readonly eventAttendeesRepo: Repository<EventAttendees>,
        @InjectRepository(Events)
        private readonly eventRespository: Repository<Events>
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
        const result = await this.eventAttendeesRepo.save(eventAttend);
        return result;
    }
    async getAttendees(searchAttendeesDto: SearchAttendeesDto, response: Response) {
        const apiId = 'api.get.Attendees';
        try {
            if (searchAttendeesDto.userId) {
                const query = `SELECT * FROM "Users" WHERE "userId"='${searchAttendeesDto.userId}'`;
                const user = await this.eventAttendeesRepo.query(query);
                if (user.length === 0) {
                    return response
                        .status(HttpStatus.NOT_FOUND)
                        .send(APIResponse.error(apiId, 'User not found', 'Invalid User.', 'NOT_FOUND'));
                }
                const attendees = await this.eventAttendeesRepo.find({ where: { userId: searchAttendeesDto.userId } });
                if (!attendees || attendees.length === 0) {
                    return response
                        .status(HttpStatus.NOT_FOUND)
                        .send(APIResponse.error(apiId, `No attendees found for this user Id : ${searchAttendeesDto.userId}`, 'No attendees found.', 'NOT_FOUND'));
                }
                return response
                    .status(HttpStatus.OK)
                    .send(APIResponse.success(apiId, { attendees, ...user[0] }, 'OK'));
            }
            else if (searchAttendeesDto.eventId) {
                const eventID = searchAttendeesDto.eventId;
                const getEventById = await this.eventRespository.findOne({ where: { eventID } });
                if (!getEventById) {
                    return response
                        .status(HttpStatus.NOT_FOUND)
                        .send(
                            APIResponse.error(
                                apiId,
                                `No event found for: ${eventID}`,
                                'No records found.',
                                'NOT_FOUND',
                            ),
                        );
                }
                const attendees = await this.eventAttendeesRepo.find({ where: { eventId: eventID } });
                return response
                    .status(HttpStatus.OK)
                    .send(APIResponse.success(apiId, attendees, 'OK'));
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
}
