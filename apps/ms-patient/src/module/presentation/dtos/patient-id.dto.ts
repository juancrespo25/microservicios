import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, Min} from "class-validator";

export class PatientIdDTO {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    patientId: number
}