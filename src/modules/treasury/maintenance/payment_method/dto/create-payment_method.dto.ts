import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreatePaymentMethodDto {
    @IsNotEmpty()
    method: any;
    @IsNotEmpty()
    @IsString()
    typeMethodPayment: string;
    @IsString()
    @IsOptional()
    Description?: string;
    @IsNumber()
    @IsNotEmpty()
    code: number;
}
