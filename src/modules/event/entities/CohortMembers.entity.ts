// cohort-member.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'CohortMembers' })
export class CohortMember {
    @PrimaryGeneratedColumn('uuid')
    cohortMembershipId: string;

    // @Column({ type: 'text', nullable: false })
    // role: string;

    // @Column({ type: 'text', nullable: true })
    // createdBy: string;

    // @Column({ type: 'text', nullable: true })
    // updatedBy: string;

    // @Column({ type: 'uuid', nullable: false })
    // tenantId: string;

    // @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    // createdAt: Date;

    @Column({ type: 'uuid', nullable: true })
    cohortId: string;

    @Column({ type: 'uuid', nullable: true })
    userId: string;

}
