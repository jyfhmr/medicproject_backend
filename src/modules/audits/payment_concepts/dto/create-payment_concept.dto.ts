import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
export class IsrlWitholdingDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    codeSeniat: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    taxBase: number;

    @ApiProperty()
    @IsNumber()
    pageRangeBS: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    ratesOrPorcentage: number; // Asegúrate de que sea un número

    @ApiProperty()
    @IsNumber()
    sustractingBS: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    typesPeopleIsrl: number;
}
export class CreatePaymentConceptDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    numeroLiteral: string;

    @ApiProperty({ type: [IsrlWitholdingDto] })
    @IsNotEmpty()
    IsrlWitholdings: any;
}
