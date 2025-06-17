
import type { Request, Response } from "express";
import { GatewayApplication} from "../application";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppointmentCreateDTO, AuthLoginDto, PatientCreateDTO } from "./dtos";

export class GatewayController {

    constructor(private readonly application: GatewayApplication) { }

    async bookAppointment(request: Request, response: Response){

        const appointmentDTO = plainToInstance(AppointmentCreateDTO, request.body);
        const errors = await validate(appointmentDTO);

        if(errors.length > 0) {
            response.status(411).json({status: 400, message: "Validation error", errors});
        }else{
            const appointmentCreate = await this.application.bookAppointment(appointmentDTO.patientId, appointmentDTO.scheduleId, appointmentDTO.countryISO);
            response.status(201).json(appointmentCreate);

        }
    }

    async createPatient(request: Request, response: Response) {
        const patientDTO = plainToInstance(PatientCreateDTO, request.body);
        const errors = await validate(patientDTO);
        if(errors.length > 0) {
            response.status(411).json({status: 400, message: "Validation error"});
        }else{
            const patientCreate = await this.application.createPatient(patientDTO.name, patientDTO.lastName, patientDTO.email, patientDTO.password, patientDTO.age, patientDTO.genre);
            response.status(201).json(patientCreate);
        }
    }

    async login(request: Request, response: Response) {
        const authLoginDto = plainToInstance(AuthLoginDto, request.body);
        const error = await validate(authLoginDto);

        if(error.length > 0) {
            response.status(411).json({status: 400, message: "Validation error", errors: error});
        } else {
            const authLogin = await this.application.login(authLoginDto.email, authLoginDto.password);
            if(authLogin) {
                response.status(200).json(authLogin);
            } else {
                response.status(401).json({status: 401, message: "Unauthorized"});
            }
        }
    }
}