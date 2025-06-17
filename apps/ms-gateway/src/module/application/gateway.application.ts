import { GatewayPort } from "../ports";

export class GatewayApplication {
    constructor(private readonly port: GatewayPort) {
    }

    async bookAppointment(patientId: number, scheduleId: number, countryISO: string){
        return await this.port.bookAppointment(patientId, scheduleId, countryISO);
    }

    async createPatient(name: string, lastName: string, email: string, password: string, age: number, genre: string) {
        return  this.port.createPatient(name, lastName, email, password, age, genre)
    }
    async login(email: string, password: string) {
        return this.port.login(email, password);
    }

}
