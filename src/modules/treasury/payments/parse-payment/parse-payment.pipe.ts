import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParsePaymentPipe implements PipeTransform {
  transform(values: any) {
    
    console.log("Values from front from Pipe",values)

    // Campos que deben ser transformados a enteros
    const numericFields = [
      'currencyUsed',
      'payment_method',
      'amountPaid',
      'bankEmissor',
      'bankReceptor',
      'transfer_account_number',
      'transfer_account_number_of_receiver'
    ];

    if(values){
       values.amountPaid = Number(values.amountPaid)
       values.bankReceptor =  Number(values.bankReceptor)
       values.payment_method = Number(values.payment_method)
    }

    // Verificar si el campo existe antes de transformarlo

    console.log("VALUES DESPUES DE TRANSOFRMACION",values)

    return values;
  }
}
