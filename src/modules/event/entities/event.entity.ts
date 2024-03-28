import { EventAttendees } from 'src/modules/attendees/entity/attendees.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
@Entity('Events')
export class Events {
    @PrimaryGeneratedColumn('uuid')
    eventID: string;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    shortDescription: string;

    @Column({ nullable: false })
    description: string;

    @Column({ nullable: false })
    image: string;

    @Column({ nullable: false })
    eventType: string;

    @Column({ nullable: false, default: false })
    isRestricted: boolean;

    @Column({ nullable: false, type: 'timestamp' })
    startDatetime: Date;

    @Column({ nullable: false, type: 'timestamp' })
    endDatetime: Date;

    @Column({ nullable: false })
    location: string;

    @Column({ nullable: false, type: 'double precision' })
    longitude: number;

    @Column({ nullable: false, type: 'double precision' })
    latitude: number;

    @Column({ nullable: false })
    onlineProvider: string;

    @Column({ nullable: false, type: 'timestamp' })
    registrationDeadline: Date;

    @Column({ nullable: false, default: 0 })
    maxAttendees: number;

    @Column({ nullable: false, type: 'json' })
    params: any;

    @Column({ nullable: false, type: 'json' })
    recordings: any;

    @Column({ nullable: false })
    status: string;

    @Column({ nullable: false })
    createdBy: string;

    @Column({ nullable: false })
    updatedBy: string;


    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    // @ManyToOne(() => EventAttendees, eventAttendees => eventAttendees.event)
    // eventAttendees: EventAttendees;

}
