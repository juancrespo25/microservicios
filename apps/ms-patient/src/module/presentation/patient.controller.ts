
import type { Request, Response } from "express";
import { Patient, PatientApplication, } from "../application";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { PatientCreateDTO } from "./dtos";
import { PatientService } from "./patient.service";
import { PatientEmailDTO } from "./dtos/patient-email";
import { PatientIdDTO } from "./dtos/patient-id.dto";

export class PatientController {

    constructor(private readonly application: PatientApplication) { }

    async create(request: Request, response: Response) {

        const patientDTO = plainToInstance(PatientCreateDTO, request.body);
        const errors = await validate(patientDTO);

        if (errors.length > 0) {
            response.status(411).json({ status: 400, message: "Validation error", errors });
        } else {

            const patient = new Patient({ ...request.body, password: await PatientService.crypt(request.body.password) });
            const patientCreate = await this.application.create(patient);
            response.status(201).json({ status: 201, message: "Patient created", appointment: patientCreate.properties });

        }
    }

    async getByEmail(request: Request, response: Response) {

        const patientEmailDTO = plainToInstance(PatientEmailDTO, request.params);
        const errors = await validate(patientEmailDTO);

        if (errors.length > 0) {
            response.status(411).json({ status: 400, message: "Validation error", errors });
        } else {
            const { email } = request.params;
            const patient = await this.application.getByEmail(email);

            if (!patient) {
                response.status(404).json({ status: 404, message: "Patient not found" });
            } else {
                response.status(200).json({ status: 200, message: "Patient found", patient: patient.properties });
            }
        }
    }

    async getById(request: Request, response: Response) {
        const patientIdDTO = plainToInstance(PatientIdDTO, request.params);
        const errors = await validate(patientIdDTO);

        if (errors.length > 0) {
            response.status(411).json({ status: 400, message: "Validation error", errors });
        } else {
            const { patientId } = request.params;
            const patient = await this.application.getById(Number(patientId));

            if (!patient) {
                response.status(404).json({ status: 404, message: "Patient not found" });
            } else {
                response.status(200).json({ status: 200, message: "Patient found", patient: patient.properties });
            }
        }
    }


}