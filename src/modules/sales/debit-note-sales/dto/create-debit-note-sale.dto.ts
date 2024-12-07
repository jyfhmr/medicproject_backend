import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDebitNoteSaleDto {
    @IsString()
    @IsNotEmpty()
    address: string;

    @IsNumber()
    @IsNotEmpty()
    phone: number;

    @IsNumber()
    @IsNotEmpty()
    typePayment: number;

    @IsNumber()
    @IsNotEmpty()
    applyBook: number;

    // @IsNumber()
    // @IsNotEmpty()
    // module: number;

    @IsString()
    @IsNotEmpty()
    numberCreditNote: string;

    @IsString()
    @IsNotEmpty()
    numberFacture: string;

    @IsString()
    @IsNotEmpty()
    controlNumber: string;

    @IsString()
    @IsNotEmpty()
    createAtDebit: string;

    @IsString()
    @IsOptional()
    dueDate: string;
    @IsBoolean()
    @IsOptional()
    statusDebit: boolean;

    @IsNumber()
    @IsOptional()
    igtf: number;

    @IsNumber()
    @IsOptional()
    partialorTotal: number;

    @IsString()
    @IsOptional()
    correlative: string;

    // tabla

    @IsString()
    observation: string;

    @IsNumber()
    @IsNotEmpty()
    subtotal: number;

    @IsNumber()
    @IsNotEmpty()
    rage: number;

    @IsNumber()
    @IsNotEmpty()
    discount: number;

    @IsNumber()
    @IsNotEmpty()
    vat: number;

    @IsNumber()
    @IsNotEmpty()
    total: number;

    motive: number;

    motiveBalances: string;

    @IsNumber()
    @IsNotEmpty()
    exempt: number;
}
