import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDiscountTypeDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}
