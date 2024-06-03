import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsEnum, IsString, IsUUID, Max, Min, IsJSON, IsLatitude, IsLongitude, IsDateString, IsObject, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateMeetingDto {

    @ApiProperty({
        type: String,
        description: 'meetingType',
        example: 'zoom',
    })
    @IsString()
    // @IsNotEmpty()
    meetingType: string;


    @ApiProperty({
        type: String,
        description: 'topic',
        example: 'Test Meeting',
    })
    @IsString()
    @IsNotEmpty()
    topic: string;



    @ApiProperty({
        type: Number,
        description: '2',
        example: 2,
    })
    @IsNumber()
    @IsNotEmpty()

    @ApiProperty({
        type: String,
        description: 'meetingType',
        example: 'zoom',
    })
    @IsString()
    @IsNotEmpty()
    type: number;


    @ApiProperty({
        type: Date,
        description: 'Start Datetime',
        example: '2024-03-18T10:00:00Z'
    })
    start_time: Date;


    @ApiProperty({
        type: String,
        description: 'time',
        example: '60'
    })
    duration: number;


    @ApiProperty({
        type: String,
        description: 'timezone',
        example: 'Asia/Kolkata',
    })
    timezone: string;
}
