import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateRates2RangeDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    readonly minimumAmountPaid: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    readonly maximumAmountPaid: number;


    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    readonly retentionPorcentage: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    readonly sustractingUT: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    readonly sustractingBs: number;

    @ApiProperty()
    @IsOptional()
    user?: any;

    @ApiProperty()
    @IsOptional()
    userUpdate?: any;

}
