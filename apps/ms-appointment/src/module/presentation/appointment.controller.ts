
import type { Request, Response } from "express";
import { Appointment, AppointmentApplication } from "../application";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppointmentCreateDTO } from "./dtos";

export class AppointmentController {

    constructor(private readonly application: AppointmentApplication) { }

    async create(request: Request, response: Response){

        const appointmentDTO = plainToInstance(AppointmentCreateDTO, request.body);
        const errors = await validate(appointmentDTO);

        if(errors.length > 0) {
            response.status(411).json({status: 400, message: "Validation error", errors});
        }else{
            const appointment= new Appointment(request.body);
            const appointmentCreate = await this.application.create(appointment);
            response.status(201).json({status: 201, message: "Appointment created", appointment: appointmentCreate.properties});

        }
    }
}