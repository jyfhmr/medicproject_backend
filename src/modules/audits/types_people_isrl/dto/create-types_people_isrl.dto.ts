import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTypesPeopleIsrlDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly type: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly code: string;
}
