import { KafkaService } from "lib-kafka";
import { DatabaseBootstrap } from "../../bootstrap";
import { Appointment } from "../application";
import { AppointmentPort } from "../ports/appointment.port";
import { AppointmentEntity } from "./entities";
import { env } from "../../env";
import { v4 as uuidv4 } from 'uuid'

export class AppointmentAdapter implements AppointmentPort {
    async add(appointment: Appointment): Promise<Appointment> {

        try {
            console.log(appointment)
            const appointmentRetured = await this.addToDataBase(appointment);
            await this.publishToKafka(appointment);
            return appointmentRetured;
       } catch (error) {
            await this.publishToKafka(appointment, true);
            console.error("Error adding appointment to database or publishing to Kafka:", error);

        }

    }

    private async addToDataBase(appointment: Appointment): Promise<Appointment> {
        const repository = DatabaseBootstrap.dataSource.getRepository(AppointmentEntity);
        const { patientId, scheduleId, createdAt, updatedAt, countryISO, appointmentId } = appointment.properties;

        const entity = new AppointmentEntity();
        Object.assign(entity, { patientId, scheduleId, status: "CONFIRMED", countryISO, createdAt, updatedAt, appointmentId });
        const appointmentCreated = await repository.save(entity);

        return new Appointment(appointmentCreated);
    }

    private async publishToKafka(appointment: Appointment, error: boolean = false): Promise<void> {

        const { patientId, scheduleId, createdAt, updatedAt, countryISO, appointmentId } = appointment.properties;
        console.log(`Publishing appointment ${appointmentId} to kafka`);


        const producer = KafkaService.instance.getProducer();
        const topicConfirm = env.KAFKA_TOPIC_CONFIRM;
        const topicError = env.KAFKA_TOPIC_ERROR

        await producer.send({
            topic: topicConfirm, messages: [{
                key: uuidv4(),
                value: JSON.stringify({ patientId, scheduleId, createdAt, updatedAt, countryISO, appointmentId, status: !error ? "CONFIRMED" : "ERROR" })
            }]
        })

        /* await producer.send({
             topic: topicError, messages: [{
                 key: uuidv4(),
                 value: JSON.stringify({ patientId, scheduleId, createdAt, updatedAt, countryISO, appointmentId, status: "ERROR" })
             }]
         })*/
    }

}