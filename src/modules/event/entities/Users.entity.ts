import { EventAttendees } from 'src/modules/attendees/entity/attendees.entity';
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity({ name: 'Users' })
export class Users {
    @PrimaryColumn('uuid')
    userId: string;

    @Column({ nullable: false })
    username: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    role: string;

    @Column({ type: 'date', nullable: true })
    dob: Date;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    district: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    pincode: string;

    @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ nullable: true, type: 'numeric' })
    mobile: number;

    @Column({ nullable: true })
    createdBy: string;

    @Column({ nullable: true })
    updatedBy: string;

    @Column({ nullable: false })
    tenantId: string;

    @Column({ default: 'active', nullable: false })
    status: string;

    @OneToMany(() => EventAttendees, attendee => attendee.user)
    eventAttendees: EventAttendees[];
}
