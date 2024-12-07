import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBankDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    @IsOptional()
    branch?: string;
    @IsString()
    @IsOptional()
    adress?: string;
    @IsString()
    @IsNotEmpty()
    bankCode: string;
    @IsString()
    @IsOptional()
    phone?: string;
    @IsString()
    @IsOptional()
    email?: string;
    @IsString()
    @IsOptional()
    aba?: string;
    @IsString()
    @IsOptional()
    routeNumber?: string;
    @IsString()
    @IsOptional()
    swift?: string;
    @IsString()
    @IsOptional()
    urbanization?: string;
    @IsString()
    @IsOptional()
    street?: string;
    @IsString()
    @IsOptional()
    building?: string;
    @IsString()
    @IsOptional()
    municipality?: string;
    @IsString()
    @IsOptional()
    city?: string;
    @IsString()
    @IsOptional()
    codeZip?: string;
}
