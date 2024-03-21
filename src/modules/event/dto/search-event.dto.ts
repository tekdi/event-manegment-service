import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsDateString, IsEnum, IsString } from "class-validator";

export class FilterDto {

    @ApiProperty({ example: '2024-01-01', description: 'Start date in YYYY-MM-DD format' })
    @IsDateString()
    startDate: string;

    @ApiProperty({ example: '2024-01-01', description: 'Start date in YYYY-MM-DD format' })
    @IsDateString()
    endDate: string;

    @ApiProperty({
        example: ['Live', 'Draft', 'Inactive'],
        description: 'Array of status values: Live, Draft, Inactive'
    })
    @IsOptional()
    @IsEnum(['Live', 'Draft', 'Inactive'], { each: true })
    status?: string[];

    @ApiProperty({
        example: ['online', 'offline', 'onlineandoffline'],
        description: 'Array of status values: online, offline, onlineandoffline'
    })
    @IsOptional()
    @IsEnum(['online', 'offline', 'onlineandoffline'], { each: true })
    eventType?: string[];

    @ApiProperty({ example: 'Event Title', description: 'Event title' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ example: 'John Doe', description: 'Created by user' })
    @IsOptional()
    @IsString()
    createdBy?: string;
}

export class SearchFilterDto {
    @ApiProperty({ type: FilterDto, description: 'Filters for search' })
    filters: FilterDto
}