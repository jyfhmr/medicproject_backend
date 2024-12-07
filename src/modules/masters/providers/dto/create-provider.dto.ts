import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDate, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProviderDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.toUpperCase())
    readonly businessName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.toUpperCase())
    readonly tradeName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly identification: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly documentType: any;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => +value)
    readonly phone: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    readonly email: string;
    @ApiProperty()
    @IsNotEmpty()
    readonly city: any;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly address: string;

    @ApiProperty()
    //@IsNotEmpty()
    //@IsString()
    readonly website: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    //@Transform(({ value }) => +value)
    readonly taxRetentionPercentage: any;

    @ApiProperty()
    @IsNotEmpty()
    readonly taxpayer: any;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.toUpperCase())
    readonly legalRepresentativeName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => value.toUpperCase())
    readonly legalRepresentativeLastName: string;

    @ApiProperty()
    @IsDate()
    @Transform(({ value }) => {
        return new Date(value);
    })
    @ApiProperty()
    readonly constitutionDate: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    readonly paymentConcepts: any;

    @ApiProperty()
    @IsNotEmpty()
    readonly typePeopleIsrl: any;
}
