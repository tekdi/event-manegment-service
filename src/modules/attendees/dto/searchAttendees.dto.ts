import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SearchAttendeesDto {
    @ApiProperty({
        description: 'The UUID of the user',
        example: 'd0c9b682-158e-4a27-af0c-c30d74956062'
    })
    @Optional()
    @IsUUID()
    userId: string;

    @ApiProperty({
        description: 'The UUID of the event',
        example: '24c46148-16cc-4f92-81fe-6a794ef8dabf'
    })
    @Optional()
    @IsUUID()
    eventId: string;
}
