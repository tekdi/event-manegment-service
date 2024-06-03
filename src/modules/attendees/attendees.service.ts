import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { EventAttendeesDTO } from './dto/EventAttendance.dto';
import { Response } from 'express';
import APIResponse from 'src/common/utils/response';
import { EventAttendees } from './entity/attendees.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchAttendeesDto } from './dto/searchAttendees.dto';
import { UpdateAttendeesDto } from './dto/updateAttendees.dto';

@Injectable()
export class AttendeesService {
    constructor(
        @InjectRepository(EventAttendees)
        private readonly eventAttendeesRepo: Repository<EventAttendees>
    ) { }

    async createSingleAttendees(eventAttendeesDTO: EventAttendeesDTO, response: Response, userId: string) {
        const apiId = 'create.event.attendees';
        try {
            const attendees = await this.eventAttendeesRepo.find({ where: { userId, eventId: eventAttendeesDTO.eventId } });
            if (attendees.length > 0) {
                throw new BadRequestException(`You have already registered for this event: ${eventAttendeesDTO.eventId}`)
            }
            const userIdArray = [userId];
            const result = await this.saveattendessRecord(eventAttendeesDTO, userIdArray);
            return APIResponse.success(response, apiId, { attendeesId: result[0]?.eventAttendeesId }, String(HttpStatus.CREATED), 'Created')
        }
        catch (e) {
            return APIResponse.error(response, apiId, "Internal Server Error", `Error is ${e}`, String(HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    async saveattendessRecord(eventAttendeesDTO: EventAttendeesDTO, userIds: string[]) {
        try {
            const eventAttendees = userIds.map(userId => ({
                userId: userId,
                eventId: eventAttendeesDTO.eventId,
                joinedLeftHistory: [],
                duration: 0,
                isAttended: false,
                status: eventAttendeesDTO.status,
                enrolledBy: eventAttendeesDTO.enrolledBy
            }));

            const results = await this.eventAttendeesRepo.save(eventAttendees);
            return results;
        }
        catch (e) {
            return e;
        }
    }

    async getAttendees(searchAttendeesDto: SearchAttendeesDto, response: Response) {
        const apiId = 'api.get.Attendees';
        const { userId, eventId } = searchAttendeesDto;
        try {
            if (userId && eventId) {
                const attendees = await this.eventAttendeesRepo.find({ where: { userId, eventId } });
                if (!attendees || attendees.length === 0) {
                    APIResponse.error(response, apiId, `User : ${userId}: not regitered for this event : ${eventId} `, 'No attendees found.', 'NOT_FOUND')
                }
                APIResponse.success(response, apiId, attendees, String(HttpStatus.OK), 'OK')
            }
            else if (userId) {
                const query = `SELECT * FROM "Users" WHERE "userId"='${userId}'`;
                const user = await this.eventAttendeesRepo.query(query);
                if (user.length === 0) {
                    return response
                        .status(HttpStatus.NOT_FOUND)
                        .send(APIResponse.error(response, apiId, 'User not found', 'User Not Exist.', 'NOT_FOUND'));
                }
                const attendees = await this.eventAttendeesRepo.find({ where: { userId: userId } });
                if (!attendees || attendees.length === 0) {
                    return response
                        .status(HttpStatus.NOT_FOUND)
                        .send(APIResponse.error(response, apiId, `No attendees found for this user Id : ${userId}`, 'No attendees found.', 'NOT_FOUND'));
                }
                return response
                    .status(HttpStatus.OK)
                    .send(APIResponse.success(response, apiId, { attendees, ...user[0] }, String(HttpStatus.OK), 'OK'));
            }
            else if (eventId) {
                const eventID = eventId;
                const attendees = await this.eventAttendeesRepo.find({ where: { eventId: eventID } });
                if (!attendees || attendees.length === 0) {

                    APIResponse.error(
                        response,
                        apiId,
                        `No attendees found for this event Id : ${eventId}`,
                        'No records found.',
                        'NOT_FOUND',
                    )
                }
                APIResponse.success(response, apiId, attendees, String(HttpStatus.OK), 'OK')
            }
        }
        catch (e) {
            APIResponse.error(response, apiId, "Internal Server Error", `Error is ${e}`, String(HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    async deleteAttendees(searchAttendeesDto: SearchAttendeesDto, response: Response) {
        const apiId = 'api.delete.attendees';
        const { userId, eventId } = searchAttendeesDto
        try {
            if (eventId && !userId) {
                const deleteAttendees = await this.deleteEventAttendees(eventId);

                APIResponse.success(
                    response,
                    apiId,
                    { status: `Event Attendees for event ID ${eventId} deleted successfully.${deleteAttendees.affected} rows affected` },
                    String(HttpStatus.OK),
                    'OK',
                )
            }
            else if (userId && !eventId) {
                const deleteAttendees = await this.deleteUserAttendees(userId);
                return response
                    .status(HttpStatus.OK)
                    .send(
                        APIResponse.success(
                            response,
                            apiId,
                            { status: `Event Attendees for user ID ${userId} deleted successfully.${deleteAttendees.affected} rows affected` },
                            String(HttpStatus.OK),
                            'OK',
                        ),
                    );
            }
            else if (userId && eventId) {
                const deletedAttendees = await this.eventAttendeesRepo.delete({ eventId, userId });
                if (deletedAttendees.affected != 1) {
                    throw new BadRequestException('Not deleted');
                }

                APIResponse.success(
                    response,
                    apiId,
                    { status: `Event Attendees for user and eventId deleted successfully.` },
                    String(HttpStatus.OK),
                    'OK',
                )

            }
        }
        catch (e) {
            APIResponse.error(response, apiId, "Internal Server Error", `Error is ${e}`, String(HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }

    public async deleteEventAttendees(eventId: string) {
        try {
            const deletedAttendees = await this.eventAttendeesRepo
                .createQueryBuilder()
                .delete()
                .from(EventAttendees)
                .where('"eventId" = :eventId', { eventId })
                .execute();
            return deletedAttendees;
        }
        catch (e) {
            throw new BadRequestException('Event not deleted', e);
        }
    }

    public async deleteUserAttendees(userId: string) {
        try {
            const deletedAttendees = await this.eventAttendeesRepo
                .createQueryBuilder()
                .delete()
                .from(EventAttendees)
                .where('"userId" = :userId', { userId })
                .execute();
            return deletedAttendees;
        }
        catch (e) {
            throw new BadRequestException('users not deleted', e);
        }
    }

    async updateAttendees(updateAttendeesDto: UpdateAttendeesDto, response: Response) {
        const apiId = 'api.update.attendees';
        try {
            const attendees = await this.eventAttendeesRepo.findOne({ where: { eventId: updateAttendeesDto.eventId, userId: updateAttendeesDto.userId } })
            if (!attendees) {

                APIResponse.error(
                    response,
                    apiId,
                    `No record found for this: ${updateAttendeesDto.eventId} and ${updateAttendeesDto.userId}`,
                    'records not found.',
                    'NOT_FOUND',
                )
            }
            if (updateAttendeesDto.joinedLeftHistory && Object.keys(updateAttendeesDto.joinedLeftHistory).length > 0) {
                updateAttendeesDto.joinedLeftHistory = attendees.joinedLeftHistory.concat(updateAttendeesDto.joinedLeftHistory);
            }
            Object.assign(attendees, updateAttendeesDto);
            const updated_result = await this.eventAttendeesRepo.save(attendees);
            if (!updated_result) {
                throw new BadRequestException('Attendees updation failed');
            }
            return response
                .status(HttpStatus.OK)
                .send(APIResponse.success(response, apiId, updateAttendeesDto, String(HttpStatus.OK), 'updated'))
        }
        catch (e) {
            APIResponse.error(response, apiId, "Internal Server Error", `Error is ${e}`, String(HttpStatus.INTERNAL_SERVER_ERROR));
        }
    }
}
