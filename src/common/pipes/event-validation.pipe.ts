import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CreateEventDto } from 'src/modules/event/dto/create-event.dto';

@Injectable()
export class EventValidationPipe implements PipeTransform {
    transform(createEventDto: CreateEventDto) {
        const startDate = new Date(createEventDto.startDatetime);
        const endDate = new Date(createEventDto.endDatetime);
        const registrationDeadline = new Date(createEventDto.registrationDeadline);
        if (endDate < startDate) {
            throw new BadRequestException('End date should be greater than or equal to start date');
        }
        if (registrationDeadline < startDate || registrationDeadline > endDate) {
            throw new BadRequestException('Registration deadline should be between start date and end date');
        }
        if (createEventDto.isRestricted && Object.keys(createEventDto.params).length === 0) {
            throw new BadRequestException('Params should not be empty when isRestricted is true')
        }
        else if (!createEventDto.isRestricted) {
            createEventDto.params = {};
        }
        return createEventDto;
    }
}
