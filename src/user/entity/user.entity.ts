import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  first_name: string;

  @Column({ type: 'text' })
  last_name: string;

  @Column({ type: 'date' })
  birthday: Date;

  @Column({ type: 'text' })
  location: string;

  @Column({ type: 'decimal' })
  offset: number;

  @Column({ type: 'timestamp' })
  reminder_time: Date;
}
