import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsMobilePhone,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';
import { Gender, MaritalStatus } from '../entities/patient.entity';

export class CreatePatientDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    dni: string;

    @IsNotEmpty()
    @IsString()
    @IsMobilePhone('es-VE')
    phone: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    birthdate: Date;

    @IsNotEmpty()
    @IsEnum(Gender)
    gender: Gender;

    @IsNotEmpty()
    @IsEnum(MaritalStatus)
    marital_status: MaritalStatus;

    @IsOptional()
    @IsString()
    preexisting_conditions: string;

    @IsOptional()
    @IsString()
    family_history: string;

    @IsOptional()
    @IsString()
    emergency_contact_name: string;

    @IsOptional()
    @IsString()
    @IsMobilePhone('es-VE')
    emergency_contact_phone: string;

    @IsNotEmpty()
    @IsBoolean()
    smoker: boolean;

    @IsNotEmpty()
    @IsBoolean()
    alcohol_drinker: boolean;
}
