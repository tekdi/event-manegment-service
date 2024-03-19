import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min, IsJSON, IsLatitude, IsLongitude, IsDateString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  // @IsUUID()
  eventID: string;

  @ApiProperty({
    type: String,
    description: 'title',
    example: 'Sample Event',
  })
  @IsString()
  @IsNotEmpty()
  title: string;


  @ApiProperty({
    type: String,
    description: 'shortDescription',
    example: 'This is a sample event'
  })
  @IsString()
  @IsNotEmpty()
  shortDescription: string;


  @ApiProperty({
    type: String,
    description: 'description',
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  })
  @IsString()
  @IsNotEmpty()
  description: string;


  @ApiProperty({
    type: String,
    description: 'image',
    example: 'https://example.com/sample-image.jpg'
  })
  @IsString()
  @IsNotEmpty()
  image: string;


  @ApiProperty({
    type: String,
    description: 'eventType',
    example: 'Conference'
  })
  @IsString()
  @IsNotEmpty()
  eventType: string;

  @ApiProperty({
    type: String,
    description: 'isRestricted',
    example: false
  })
  @IsBoolean()
  isRestricted: boolean;

  @ApiProperty({
    type: String,
    description: 'Start Datetime',
    example: '2024-03-18T10:00:00Z'
  })
  @IsDateString()
  startDatetime: string;

  @ApiProperty({
    type: String,
    description: 'End Datetime',
    example: '2024-03-18T10:00:00Z'
  })
  @IsDateString()
  endDatetime: string;

  @ApiProperty({ type: String, description: 'Location', example: 'Event Location' })
  @IsString()
  @IsNotEmpty()
  location: string;


  @ApiProperty({ type: Number, description: 'Latitude' })
  @IsLongitude()
  longitude: number;

  @ApiProperty({ type: Number, description: 'Latitude' })
  @IsLatitude()
  latitude: number;

  @ApiProperty({ type: String, description: 'Online Provider', example: 'Zoom' })
  @IsString()
  @IsNotEmpty()
  onlineProvider: string;

  @ApiProperty({ type: String, description: 'Registration Deadline', example: '2024-03-17T23:59:59Z' })
  @IsDateString()
  registrationDeadline: string;

  @ApiProperty({ type: Number, description: 'Max Attendees', example: 100 })
  @IsInt()
  @Min(0)
  maxAttendees: number;

  @ApiProperty({ type: Object, description: 'Params', example: { key: 'value' } })
  @IsObject()
  params: any;

  @ApiProperty({ type: Object, description: 'Recordings', example: { url: 'https://example.com/recording' } })
  @IsObject()
  recordings: any;

  @ApiProperty({ type: String, description: 'Status', example: 'Active' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ type: String, description: 'Created By', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @ApiProperty({ type: String, description: 'updated By', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  updatedBy: string;

}

