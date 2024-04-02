import { Users } from 'src/modules/event/entities/Users.entity';
import { Events } from 'src/modules/event/entities/event.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, JoinColumn, UpdateDateColumn } from 'typeorm';

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

    @Column({ type: 'jsonb', nullable: true })
    joinedLeftHistory: any;

    @Column({ nullable: false, default: 0 })
    duration: number;

    @Column()
    status: string;

    @CreateDateColumn({ type: 'timestamp' })
    enrolledAt: Date;

    @Column({ type: 'uuid', nullable: true })
    enrolledBy: string;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @Column({ type: 'uuid', nullable: true })
    updatedBy: string;

    @ManyToOne(() => Events, event => event.eventAttendees)
    @JoinColumn({ name: 'eventId' })
    event: Events;

    @ManyToOne(() => Users, user => user.eventAttendees)
    @JoinColumn({ name: 'userId' })
    user: Users;

}