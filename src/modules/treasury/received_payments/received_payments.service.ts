import { Injectable } from '@nestjs/common';
import { CreateReceivedPaymentDto } from './dto/create-received_payment.dto';
import { UpdateReceivedPaymentDto } from './dto/update-received_payment.dto';

@Injectable()
export class ReceivedPaymentsService {
  create(createReceivedPaymentDto: CreateReceivedPaymentDto) {
    return 'This action adds a new receivedPayment';
  }

  findAll() {
    return `This action returns all receivedPayments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} receivedPayment`;
  }

  update(id: number, updateReceivedPaymentDto: UpdateReceivedPaymentDto) {
    return `This action updates a #${id} receivedPayment`;
  }

  remove(id: number) {
    return `This action removes a #${id} receivedPayment`;
  }
}
