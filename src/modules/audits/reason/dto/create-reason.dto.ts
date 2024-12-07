import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateReasonDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    NameReason: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    module: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    transactionType: string;
}
