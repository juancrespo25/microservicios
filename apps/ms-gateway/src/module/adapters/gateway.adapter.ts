
import { GatewayPort } from "../ports/gateway.port";
import { env } from "../../env";

export class GatewayAdapter implements GatewayPort {


    async bookAppointment(patientId: number, scheduleId: number, countryISO: string): Promise<any> {
        return fetch(env.URL_APPOINTMENT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                patientId,
                scheduleId,
                countryISO,
            }),
        }).then(response => response.json())
    }

    async createPatient(name: string, lastName: string, email: string, password: string, age: number, genre: string) {
        return fetch(env.URL_PATIENT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, lastName, email, password, age, genre })
        }).then(response => response.json())
    }

    async login(email: string, password: string): Promise<any> {
        return await fetch(env.URL_AUTH, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password })
        }).then(response => response.json())
    }

}