import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDate,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';

export class CreateCompanyDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.toUpperCase())
    readonly name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly address: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly phone: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly rif: string;

    @ApiProperty()
    @IsOptional()
    readonly logo?: any;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    readonly profitMargin: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.toUpperCase())
    readonly businessName: string;

    @ApiProperty()
    @IsOptional()
    @IsUrl()
    readonly web?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value)) // Aseguramos que la fecha se maneje como Date
    readonly rifDueDate: Date;

    @ApiProperty()
    @IsOptional()
    readonly rifFile?: any;

    @ApiProperty()
    @IsOptional()
    readonly sealFile?: any;

    @ApiProperty()
    @IsOptional()
    readonly signatureFile?: any;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly fiscalAddress: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly nameLegalRepresentative: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly lastNameLegalRepresentative: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    readonly identificationLegalRepresentative: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value)) // Aseguramos que la fecha se maneje como Date
    readonly dueDateLegalRepresentative: Date;

    @ApiProperty()
    @IsOptional()
    readonly rifLegalRepresentativeFile?: any;

    @ApiProperty()
    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    readonly documentTypeLegalRepresentative: any;

    // multiempresa
    @ApiProperty()
    @IsNotEmpty()
    readonly isHeadquarters: boolean;

    @ApiProperty()
    @IsOptional()
    readonly headquarterOf: any;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly nameRegister: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value)) // Aseguramos que la fecha se maneje como Date
    readonly dateRegister: Date;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly volumeRegister: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    readonly numberRegister: number;
}
