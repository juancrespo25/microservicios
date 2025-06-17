import { AppointmentStatus } from "./appointment-status.enum";
import { AppointmentCountry } from "./appointment.country.enum";

export type AppointmentPropsRequired = {
    patientId: number;
    scheduleId: number;
    countryISO: AppointmentCountry
}

export type AppointmentPropsOptional = {
    appointmentId: number;
    status: AppointmentStatus;
    createdAt: Date;
    updatedAt: Date | null;
}

export type AppointmentProps = AppointmentPropsRequired & Partial<AppointmentPropsOptional>;
export class Appointment {
    private readonly appointmentId: number;
    private readonly patientId: number;
    private readonly scheduleId: number;
    private  countryISO: AppointmentCountry
    private  status: AppointmentStatus;
    private readonly createdAt: Date;
    private updatedAt: Date | null;

    constructor(props: AppointmentProps) {
        Object.assign(this, props);

        if(!this.createdAt) {
            this.createdAt = new Date();
        }
    }

    get properties(): Required<AppointmentProps> {
        return {
            appointmentId: this.appointmentId,
            patientId: this.patientId,
            scheduleId: this.scheduleId,
            countryISO: this.countryISO,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }
    update(status: AppointmentStatus) {
        this.status = status;
        this.updatedAt = new Date();
    }
}