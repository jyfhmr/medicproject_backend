import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRatesOrPorcentageDto {
    @IsNotEmpty()
    @IsString()
    value: string;
}
