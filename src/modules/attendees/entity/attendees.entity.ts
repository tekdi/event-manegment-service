import { Events } from 'src/modules/event/entities/event.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';


@Entity('EventAttendees')
export class EventAttendees {

    @PrimaryGeneratedColumn('uuid')
    eventAttendeesId: string;

    @Column({ type: 'uuid' })
    userId: string;

    @Column({ type: 'uuid' })
    eventId: string;

    @Column({ nullable: true, default: null })
    isAttended: boolean | null;

    @Column({ type: 'json', nullable: true })
    joinedLeftHistory: any;

    @Column({ nullable: false, default: 0 })
    duration: number;

    @Column()
    status: string;

    @Column({ type: 'timestamp' })
    enrolledAt: Date;

    @Column({ type: 'uuid', nullable: true })
    enrolledBy: string;

    @Column({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @Column({ type: 'uuid', nullable: true })
    updatedBy: string;

    @ManyToOne(() => Events, event => event.eventAttendees)
    @JoinColumn({ name: 'eventId' })
    event: Events;

}