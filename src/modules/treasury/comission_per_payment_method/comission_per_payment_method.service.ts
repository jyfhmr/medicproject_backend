import { Injectable } from '@nestjs/common';
import { CreateComissionPerPaymentMethodDto } from './dto/create-comission_per_payment_method.dto';
import { UpdateComissionPerPaymentMethodDto } from './dto/update-comission_per_payment_method.dto';

@Injectable()
export class ComissionPerPaymentMethodService {
  create(createComissionPerPaymentMethodDto: CreateComissionPerPaymentMethodDto) {
    return 'This action adds a new comissionPerPaymentMethod';
  }

  findAll() {
    return `This action returns all comissionPerPaymentMethod`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comissionPerPaymentMethod`;
  }

  update(id: number, updateComissionPerPaymentMethodDto: UpdateComissionPerPaymentMethodDto) {
    return `This action updates a #${id} comissionPerPaymentMethod`;
  }

  remove(id: number) {
    return `This action removes a #${id} comissionPerPaymentMethod`;
  }
}
