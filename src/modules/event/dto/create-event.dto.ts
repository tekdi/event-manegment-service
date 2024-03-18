import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min, IsJSON, IsLatitude, IsLongitude, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsUUID()
  eventID: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  eventType: string;

  @IsBoolean()
  isRestricted: boolean;

  @IsDateString()
  startDatetime: string;

  @IsDateString()
  endDatetime: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsLongitude()
  longitude: number;

  @IsLatitude()
  latitude: number;

  @IsString()
  @IsNotEmpty()
  onlineProvider: string;

  @IsDateString()
  registrationDeadline: string;

  @IsInt()
  @Min(0)
  maxAttendees: number;

  @IsJSON()
  params: any;

  @IsJSON()
  recordings: any;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

}


