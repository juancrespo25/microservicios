import { AppointmentCountry, AppointmentStatus } from "../../application";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: "appointment"})
export class AppointmentEntity {
    @PrimaryGeneratedColumn()
    appointmentId: number;

    @Column({type: "int"})
    patientId: number;

    @Column({type: "int", unique: true})
    scheduleId: number;

    @Column({type: "enum", enum: AppointmentCountry})
    countryISO: AppointmentCountry;

    @Column({type: "enum", enum: AppointmentStatus, default: AppointmentStatus.PENDING})
    status: AppointmentStatus

    @Column({type: "datetime", default: () => "CURRENT_TIMESTAMP"})
    createdAt: Date;

    @Column({ type: "datetime", nullable: true })
    updatedAt: Date;
}