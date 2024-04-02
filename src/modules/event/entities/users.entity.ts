import { EventAttendees } from 'src/modules/attendees/entity/attendees.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
@Entity('Users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ nullable: true })
  email: string;

  @Column({})
  username: string;

  @Column({})
  name: string;

  @Column({})
  role: string;

  @Column({})
  dob: Date;

  @Column({})
  district: string;

  @Column({})
  state: string;

  @Column({})
  address: string;

  @Column({})
  pincode: string;

  @Column({})
  mobile: number;
  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  updatedBy: string;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;
}
