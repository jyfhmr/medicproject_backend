import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTaxDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    value: number;
}
