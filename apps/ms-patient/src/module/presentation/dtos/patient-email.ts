import { IsEmail,  IsNotEmpty,  IsString,  MinLength } from "class-validator";

export class PatientEmailDTO {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @MinLength(3)
    email: string;
}