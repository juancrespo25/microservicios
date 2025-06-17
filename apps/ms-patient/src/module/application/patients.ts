import { PatientGenre } from "./";


export type PatientPropsRequired = {
    name: string;
    lastName: string;
    age: number;
    email: string;
    password: string;
    genre: PatientGenre;
}

export type PatientPropsOptional = {
    patientId: number;
    createdAt: Date;
}


export type PatientProps = PatientPropsRequired & Partial<PatientPropsOptional>;
export class Patient {
    private readonly patientId: number;
    private name: string;
    private lastName: string;
    private age: number;
    private email: string;
    private password: string;
    private genre: PatientGenre;
    private readonly createdAt: Date;

    constructor(props: PatientProps) {
        Object.assign(this, props);

        if(!this.createdAt) this.createdAt = new Date();

    }

    get properties(): Required<PatientProps> {
        return {
            patientId: this.patientId,
            name: this.name,
            lastName: this.lastName,
            age: this.age,
            email: this.email,
            password: this.password,
            genre: this.genre,
            createdAt: this.createdAt
        }
    }
}