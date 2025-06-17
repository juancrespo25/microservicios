
import { DatabaseBootstrap } from "../../bootstrap";
import { Patient, PatientGenre } from "../application";
import { PatientPort } from "../ports/patient.port";
import { PatientEntity } from "./entities";

export class PatientAdapter implements PatientPort {

    async add(patient: Patient): Promise<Patient> {

        const repository = DatabaseBootstrap.dataSource.getRepository(PatientEntity);
        const { patientId, name, lastName, age, email, password, genre } = patient.properties;

        const entity = new PatientEntity();
        Object.assign(entity, { patientId, name, lastName, age, email, password, genre });
        const patientCreated = await repository.save(entity);
        return new Patient({ ...patientCreated, genre: patientCreated.genre as PatientGenre });
    }

    async getById(patientId: number): Promise<Patient | null> {
        const repository = DatabaseBootstrap.dataSource.getRepository(PatientEntity);
        const patient = await repository.findOne({ where: { patientId } });

        if (!patient) return null;

        return new Patient({ ...patient, genre: patient.genre as PatientGenre });
    }
    async getByEmail(email: string): Promise<Patient | null> {
        const repository = DatabaseBootstrap.dataSource.getRepository(PatientEntity);
        const patient = await repository.findOne({ where: { email } });

        if (!patient) return null;

        return new Patient({ ...patient, genre: patient.genre as PatientGenre });
    }

}