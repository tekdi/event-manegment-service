import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Cohort' })
export class Cohort {
    @PrimaryGeneratedColumn('uuid')
    cohortId: string;

    @Column({ nullable: true })
    parentId: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    type: string;

    @Column({ nullable: false })
    status: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    referenceId: string;

    @Column({ nullable: true })
    metadata: string;

    @Column({ type: 'uuid', nullable: false })
    tenantId: string;

    @Column({ type: 'uuid', nullable: true })
    programId: string;

    @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ nullable: true })
    createdBy: string;

    @Column({ nullable: true })
    updatedBy: string;

    @Column({ default: false })
    attendanceCaptureImage: boolean;
}
