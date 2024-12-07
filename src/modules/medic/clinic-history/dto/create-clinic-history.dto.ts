import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateClinicHistoryDto {

    @IsOptional()
    files: any;

    @IsNotEmpty()
    patientId: any;

    @IsString()
    @IsOptional()
    patientDni: string

    @IsString()
    @IsNotEmpty()
    appointment_date: Date


    @IsString()
    @IsOptional()
    note: string;


    @IsString()
    @IsOptional()
    diagnosis: string;

    @IsString()
    @IsOptional()
    treatment: string;


    @IsOptional()
    @IsString()
    motive: string;

    @IsOptional()
    fileData: any
}

