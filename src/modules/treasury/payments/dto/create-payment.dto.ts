import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePaymentDto {

    @IsNotEmpty()
   // @IsNumber()
    currencyUsed: any;

    
    //@IsNotEmpty()}
    @IsOptional()
    @IsString()
    paymentReference: string

  //  @IsNumber()
    @IsNotEmpty()
    payment_method: any

   // @IsNumber()
    @IsOptional()
    provider_who_gets_the_payment?: any

 //   @IsNumber()
    @IsNotEmpty()
    type_of_identification: any

 //   @IsNumber()
    @IsNotEmpty()
    type_of_document: any

    @IsString()
    @IsNotEmpty()
    document_of_counterparty: string

    @IsString()
    @IsNotEmpty()
    name_of_counterparty: string

   
    @IsNotEmpty()
    paymentDate

    @IsNotEmpty()
    amountPaid: number

    @IsOptional()
    transfer_account_number_of_receiver: any

    @IsOptional()
    bankReceptor: any

    @IsOptional()
    bankEmissor: any

    @IsOptional()
    transfer_account_number: any

    @IsOptional()
    registerCashier: any

    //pagomovil
    pagomovilDocument: any
    pagomovilPhoneNumber:any

    //paypal y zelle
    emailReceptor: any
    emailEmisor: any

    //zelle
    addressee_name: any

    file: string


    paymentStatus: any
}
