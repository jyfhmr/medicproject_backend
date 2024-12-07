import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaxRateSeniatDto {
    @IsNumber()
    @IsNotEmpty()
    value: number;

    @IsString()
    @IsNotEmpty()
    description: string;
}
