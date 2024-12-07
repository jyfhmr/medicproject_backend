import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCorrelativeDto {
    @IsString()
    @IsNotEmpty()
    readonly module: string;

    @IsString()
    @IsNotEmpty()
    readonly subModule: string;

    @IsString()
    readonly description: string;

    @IsString()
    @IsNotEmpty()
    readonly pharmaceuticalDescription: string;

    @IsString()
    @IsNotEmpty()
    readonly correlative: number;

    @IsString()
    @IsNotEmpty()
    currentYear: string;

    @IsString()
    @IsNotEmpty()
    currentMonth: string;

    @IsString()
    @IsNotEmpty()
    currentCode: string;
}
