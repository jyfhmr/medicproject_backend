import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCashierConfigDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    balance: number;
}
