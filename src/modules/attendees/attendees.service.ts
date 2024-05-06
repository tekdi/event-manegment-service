import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { EventAttendeesDTO } from './dto/EventAttendance.dto';
import { Response } from 'express';
import APIResponse from 'src/common/utils/response';
import { EventAttendees } from './entity/attendees.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchAttendeesDto } from './dto/searchAttendees.dto';
import { UpdateAttendeesDto } from './dto/updateAttendees.dto';
import { LoggerService } from 'src/common/logger/logger.service';


@Injectable()
export class AttendeesService {
    constructor(
        @InjectRepository(EventAttendees)
        private readonly eventAttendeesRepo: Repository<EventAttendees>,
        private readonly logger: LoggerService
    ) { }

    async createAttendees(eventAttendeesDTO: EventAttendeesDTO, response: Response, userId: string, userIds?: string[]): Promise<Response> {
        const apiId = 'create.event.attendees';
        try {
            if (userIds && userIds.length > 0) {
                const result = await this.saveattendessRecord(eventAttendeesDTO, userIds);
            } else {
                const attendees = await this.eventAttendeesRepo.find({ where: { userId, eventId: eventAttendeesDTO.eventId } });
                if (attendees.length > 0) {
                    throw new BadRequestException(`You have already registered for this event: ${eventAttendeesDTO.eventId}`)
                }
                const userIdArray = [userId];
                const result = await this.saveattendessRecord(eventAttendeesDTO, userIdArray);

                this.logger.log(apiId, 'Attendees successfully registered')
                return response
                    .status(HttpStatus.CREATED)
                    .send(APIResponse.success(apiId, { attendeesId: result[0]?.eventAttendeesId }, 'Created'))
            }
        }
        catch (e) {
            this.logger.error(apiId,e,'/Failed');
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

    async saveattendessRecord(eventAttendeesDTO: EventAttendeesDTO, userIds: string[]) {
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

    async getAttendees(searchAttendeesDto: SearchAttendeesDto, response: Response) {
        const apiId = 'api.get.Attendees';
        const { userId, eventId } = searchAttendeesDto;
        try {
            if (userId && eventId) {
                const attendees = await this.eventAttendeesRepo.find({ where: { userId, eventId } });
                if (!attendees || attendees.length === 0) {
                    this.logger.error(
                        '/Get attendees details by id',
                        'No Attendees details found.',
                      )
                    return response.status(HttpStatus.NOT_FOUND).send(APIResponse.error(apiId, `User : ${userId}: not regitered for this event : ${eventId} `, 'No attendees found.', 'NOT_FOUND'));
                }
                
                this.logger.log(apiId, 'Attendees successfully registered')
                return response
                    .status(HttpStatus.OK)
                    .send(APIResponse.success(apiId, attendees, 'OK'));
            }
            else if (userId) {
                const query = `SELECT * FROM "Users" WHERE "userId"='${userId}'`;
                const user = await this.eventAttendeesRepo.query(query);
                if (user.length === 0) {
                    this.logger.error(
                        '/Get attendees details by user id',
                        'User not found', 'User Not Exist.',
                        `userId: ${userId}`
                      )
                    return response
                        .status(HttpStatus.NOT_FOUND)
                        .send(APIResponse.error(apiId, 'User not found', 'User Not Exist.', 'NOT_FOUND'));
                }
                const attendees = await this.eventAttendeesRepo.find({ where: { userId: userId } });
                if (!attendees || attendees.length === 0) {
                    this.logger.error(
                        '/Get attendees details by user id',
                        'No attendees found for this user Id.',
                        `userId: ${userId}`
                      )
                    return response
                        .status(HttpStatus.NOT_FOUND)
                        .send(APIResponse.error(apiId, `No attendees found for this user Id : ${userId}`, 'No attendees found.', 'NOT_FOUND'));
                }
                this.logger.log(apiId, 'Attendees successfully registered')
                return response
                    .status(HttpStatus.OK)
                    .send(APIResponse.success(apiId, { attendees, ...user[0] }, 'OK'));
            }
            else if (eventId) {
                const eventID = eventId;
                const attendees = await this.eventAttendeesRepo.find({ where: { eventId: eventID } });
                if (!attendees || attendees.length === 0) {
                    this.logger.error(
                        '/Get attendees details by event id',
                        'No attendees found for this event Id.',
                        `eventId: ${eventId}`
                      )
                    return response
                        .status(HttpStatus.NOT_FOUND)
                        .send(
                            APIResponse.error(
                                apiId,
                                `No attendees found for this event Id : ${eventId}`,
                                'No records found.',
                                'NOT_FOUND',
                            ),
                        );
                }
                this.logger.log(apiId, 'Attendees successfully registered')
                return response
                    .status(HttpStatus.OK)
                    .send(APIResponse.success(apiId, attendees, 'OK'));
            }
        }
        catch (e) {
            this.logger.error(apiId,e,'/Failed');
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

    async deleteAttendees(searchAttendeesDto: SearchAttendeesDto, response: Response) {
        const apiId = 'api.delete.attendees';
        const { userId, eventId } = searchAttendeesDto
        try {
            if (eventId && !userId) {
                await this.deleteEventAttendees(eventId);
                this.logger.error(
                    '/Delete attendees details by event id',
                    'Event Attendees deleted successfully.',
                    `Event Id: ${eventId}`
                  )
                return response
                    .status(HttpStatus.OK)
                    .send(
                        APIResponse.success(
                            apiId,
                            { status: `Event Attendees for event ID ${eventId} deleted successfully.` },
                            'OK',
                        ),
                    );
            }
            else if (userId && !eventId) {
                await this.deleteUserAttendees(userId);
                this.logger.error(
                    '/Delete attendees details by user id',
                    'Event Attendees deleted successfully.',
                    `User Id: ${userId}`
                  )
                return response
                    .status(HttpStatus.OK)
                    .send(
                        APIResponse.success(
                            apiId,
                            { status: `Event Attendees for user ID ${userId} deleted successfully.` },
                            'OK',
                        ),
                    );
            }
            else if (userId && eventId) {
                const deletedAttendees = await this.eventAttendeesRepo.delete({ eventId, userId });
                if (deletedAttendees.affected != 1) {
                    throw new BadRequestException('Not deleted');
                }
                this.logger.error(
                    '/Delete attendees details by id',
                    'Event Attendees for user and eventId deleted successfully.',
                    `User Id: ${userId} & Event Id: ${eventId}`
                  )
                return response
                    .status(HttpStatus.OK)
                    .send(
                        APIResponse.success(
                            apiId,
                            { status: `Event Attendees for user and eventId deleted successfully.` },
                            'OK',
                        ),
                    );
            }
        }
        catch (e) {
            this.logger.error(apiId,e,'/Failed');
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

    private async deleteEventAttendees(eventId: string) {
        const deletedAttendees = await this.eventAttendeesRepo
            .createQueryBuilder()
            .delete()
            .from(EventAttendees)
            .where('"eventId" = :eventId', { eventId })
            .execute();
        if (deletedAttendees.affected === 0) {
            throw new BadRequestException('Event not deleted');
        }
    }

    private async deleteUserAttendees(userId: string) {
        const deletedAttendees = await this.eventAttendeesRepo
            .createQueryBuilder()
            .delete()
            .from(EventAttendees)
            .where('"userId" = :userId', { userId })
            .execute();
        if (deletedAttendees.affected === 0) {
            throw new BadRequestException('User not deleted');
        }

    }

    async updateAttendees(updateAttendeesDto: UpdateAttendeesDto, response: Response) {
        const apiId = 'api.update.attendees';
        try {
            const attendees = await this.eventAttendeesRepo.findOne({ where: { eventId: updateAttendeesDto.eventId, userId: updateAttendeesDto.userId } })
            if (!attendees) {
                this.logger.error(
                    '/Patch event details by id',
                    'No record found for this event id & user id.',
                    `Event Id: ${updateAttendeesDto.eventId} & User Id: ${updateAttendeesDto.userId}`
                  )

                return response.status(HttpStatus.NOT_FOUND).send(
                    APIResponse.error(
                        apiId,
                        `No record found for this: ${updateAttendeesDto.eventId} and ${updateAttendeesDto.userId}`,
                        'records not found.',
                        'NOT_FOUND',
                    ),
                );
            }
            if (updateAttendeesDto.joinedLeftHistory && Object.keys(updateAttendeesDto.joinedLeftHistory).length > 0) {
                updateAttendeesDto.joinedLeftHistory = attendees.joinedLeftHistory.concat(updateAttendeesDto.joinedLeftHistory);
            }
            Object.assign(attendees, updateAttendeesDto);
            const updated_result = await this.eventAttendeesRepo.save(attendees);
            if (!updated_result) {
                throw new BadRequestException('Attendees updation failed');
            }

            this.logger.log(apiId, 'Attendees updated successfully')
            return response
                .status(HttpStatus.OK)
                .send(APIResponse.success(apiId, updateAttendeesDto, 'updated'))
        }
        catch (e) {
            this.logger.error(apiId,e,'/Failed');
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
