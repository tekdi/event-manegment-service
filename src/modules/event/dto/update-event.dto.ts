import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID, IsEnum, IsLongitude, IsLatitude, IsBoolean, IsInt, Min, IsDateString, IsObject } from 'class-validator';

export class UpdateEventDto {

    @ApiProperty({
        type: String,
        description: 'title',
        example: 'Sample Event'
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    title?: string;

    @ApiProperty({
        type: String,
        description: 'Short Description',
        example: 'This is a sample event',
        required: false,
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    shortDescription?: string;

    @ApiProperty({
        type: String,
        description: 'Description',
        example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description: string;


    @ApiProperty({
        type: String,
        description: 'image',
        example: 'https://example.com/sample-image.jpg'
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    image: string;

    @ApiProperty({
        type: String,
        description: 'Event Type',
        example: 'online'
    })
    @IsEnum(['online', 'offline', 'onlineandoffline'], {
        message: 'Event Type must be one of: online, offline, onlineandoffline'
    }
    )
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    eventType: string;

    @ApiProperty({
        type: String,
        description: 'isRestricted',
        example: true
    })
    @IsBoolean()
    @IsOptional()
    isRestricted: boolean;

    @ApiProperty({
        type: String,
        description: 'Start Datetime',
        example: '2024-03-18T10:00:00Z'
    })
    @IsDateString()
    @IsOptional()
    startDatetime: Date;

    @ApiProperty({
        type: String,
        description: 'End Datetime',
        example: '2024-03-18T10:00:00Z'
    })
    @IsDateString()
    @IsOptional()
    endDatetime: Date;

    @ApiProperty({
        type: String,
        description: 'Location',
        example: 'Event Location'
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    location: string;


    @ApiProperty({
        type: Number,
        description: 'Latitude',
        example: 18.508345134886994
    })
    @IsLongitude()
    @IsOptional()
    longitude: number;

    @ApiProperty({
        type: Number,
        description: 'Latitude',
        example: 18.508345134886994
    })
    @IsLatitude()
    @IsOptional()
    latitude: number;

    @ApiProperty({
        type: String,
        description: 'Online Provider',
        example: 'Zoom'
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    onlineProvider: string;

    @ApiProperty({
        type: String,
        description: 'Registration Deadline',
        example: '2024-03-18T10:00:00Z'
    })
    @IsDateString()
    @IsOptional()
    registrationDeadline: Date;

    @ApiProperty({
        type: Number,
        description: 'Max Attendees',
        example: 100
    })
    @IsInt()
    @IsOptional()
    @Min(0)
    maxAttendees: number;

    @ApiProperty({
        type: Object,
        description: 'Params',
        example: { key: 'value' }
    })
    @IsObject()
    @IsOptional()
    params: any;

    @ApiProperty({
        type: Object,
        description: 'Recordings',
        example: { url: 'https://example.com/recording' }
    })
    @IsObject()
    @IsOptional()
    recordings: any;

    @ApiProperty({
        type: String,
        description: 'Status',
        example: 'live'
    })
    @IsEnum(['live', 'draft', 'inActive'], {
        message: 'Status must be one of: live, draft, inActive',
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    status: string;

    @ApiProperty({
        type: String,
        description: 'Created By',
        example: 'John Doe'
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    createdBy: string;

    @ApiProperty({
        type: String,
        description: 'updated By',
        example: 'John Doe'
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    updatedBy: string;

    @IsOptional()
    updateAt: Date;

}

