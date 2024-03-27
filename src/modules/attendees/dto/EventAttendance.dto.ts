import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID, Min, min, } from 'class-validator';
import { UUID } from 'crypto';

export class EventAttendeesDTO {

    eventAttendeesId?: string;

    // @ApiProperty({
    //     description: '',
    //     example: 'e9fec05a-d6ab-44be-bfa4-eaeef2ef8fe9'
    // })
    // @IsUUID()
    // userId: string;

    @ApiProperty({
        description: '',
        example: 'cfee3e0e-350b-4709-83fb-07f71cd0aff8'
    })
    @IsUUID()
    eventId: string;


    @ApiProperty({
        type: String,
        description: 'Status',
        example: 'published'
    })
    @IsEnum(['published', 'unpublished'], {
        message: 'Status must be one of: published, unpublished'
    }
    )
    @IsNotEmpty()
    @IsString()
    status: string;

    @ApiProperty({
        description: '',
        example: 'e9fec05a-d6ab-44be-bfa4-eaeef2ef8fe9'
    })
    @IsUUID()
    enrolledBy?: string;

    @IsOptional()
    isAttended: boolean | null; // Allows boolean values or null

}
