import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {AxiosRequest} from '../../common/middleware/axios.middleware'


@Injectable()
export class HasuraService {
    private url: string;
    private key: string;
    constructor(private configService: ConfigService,private axiosRequest: AxiosRequest){
        this.url = this.configService.get('EVENTMANAGEMENTHASURA');
        this.key = this.configService.get('EVENTMANAGEMENTHASURAADMINSECRET');
    }

    async getEventDetails():Promise<any>{
        try {
            let query = `query GetEvents {
                Events {
                  isRestricted
                      createdBy
                      eventType
                      location
                      onlineProvider
                      shortDescription
                      status
                      title
                      updatedBy
                      latitude
                      longitude
                      maxAttendees
                      recordings
                      params
                      description
                      image
                      createdAt
                      endDatetime
                      registrationDeadline
                      startDatetime
                      updatedAt
                      eventID
                }
              }` ;
        let response = await this.axiosRequest.queryDb(this.url,this.key,query)
        return response;
        } catch (error) {
            console.log(error);
        }
        
    }

    async createEventDetails(createEventDto){
        try {
            let query = `mutation InsertEvents($eventData: Events_insert_input!) {
                insert_Events(objects: ) {
                  affected_rows
                  returning {
                          eventID
                          title
                          shortDescription
                          description
                          image
                          eventType
                          isRestricted
                          startDatetime
                          endDatetime
                          location
                          longitude
                          latitude
                          onlineProvider
                          registrationDeadline
                          maxAttendees
                          params
                          recordings
                          status
                          createdBy
                          createdAt
                          updatedBy
                          updatedAt
                  }
                }
              }
            `;
        console.log(createEventDto);
        let response = await this.axiosRequest.queryDb(this.url,this.key,query,{...createEventDto});
        console.log(response);
        return response; 
        } catch (error) {
            console.log(error);
        }

    }

    async getEventDetailById(eventId){
        try {
            let query = `query GetEvents {
                Events(where: {eventID: {_eq: $eventID}}) {
                  eventID
                  title
                  shortDescription
                  description
                  image
                  eventType
                  isRestricted
                  startDatetime
                  endDatetime
                  location
                  longitude
                  latitude
                  onlineProvider
                  registrationDeadline
                  maxAttendees
                  params
                  recordings
                  status
                  createdBy
                  createdAt
                  updatedBy
                  updatedAt
                }
              }`;
              let response = await this.axiosRequest.queryDb(this.url,this.key,query,{eventID:eventId})
              return response;
        } catch (error) {
            console.log(error);
        }
    }

}
