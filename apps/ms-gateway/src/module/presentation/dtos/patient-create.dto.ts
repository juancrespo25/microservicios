import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Min, MinLength } from "class-validator";
import { PatientGenre } from "./patient.genre.enum";


export class PatientCreateDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    lastName: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    password: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(18)
    @Type(() => Number)
    age: number;

    @IsNotEmpty()
    @IsString()
    @IsEnum(PatientGenre)
    genre: string;
}