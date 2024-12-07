import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateMovementDto } from './dto/create-movement.dto';
import { UpdateMovementDto } from './dto/update-movement.dto';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PaymentsService } from '../payments/payments.service';
import { Treasury_Movements } from './entities/movement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/modules/config/users/users.service';
import { Treasury_Payments } from '../payments/entities/payment.entity';
import { Treasury_TypeOfMovement } from '../maintenance/type_of_movement/entities/type_of_movement.entity';



@Injectable()
export class MovementsService {
 
  constructor(
    private dataSource: DataSource,
    @Inject(forwardRef(() => PaymentsService))
    private paymentService: PaymentsService,
    private usersService: UsersService,
    @InjectRepository(Treasury_Movements)
    private movementRespository: Repository<Treasury_Movements>,
  ) { }



  async create(createMovementDto: CreateMovementDto, manager?: EntityManager) {
    const usedManager = manager || this.dataSource.manager;
  
    console.log("el create movement dto",createMovementDto)

    try {
      const { idPayment, type_of_movement, amount, userId } = createMovementDto;
  
      const payment = await this.validatePayment(idPayment, usedManager);
      const movementType = await this.validateTypeOfMovement(type_of_movement,usedManager);
      const validatedAmount = await this.validateAmount(amount);
      const movementUser = await this.validateUser(userId);
  
      const newMovement = new Treasury_Movements();
      newMovement.amount = validatedAmount;
      newMovement.payment = payment;
      newMovement.type_of_movement = movementType;
      newMovement.user = movementUser;
  
      await usedManager.save(newMovement);
  
      return {
        success: true,
        message: 'Movimiento creado exitosamente',
      };
    } catch (error) {
      console.error('Ocurrió un error al generar el movimiento:', error);
      throw new HttpException(error.message, error.status || 500);
    }
  }
  
  

  findAll() {
    return `This action returns all movements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} movement`;
  }

  update(id: number, updateMovementDto: UpdateMovementDto) {
    return `This action updates a #${id} movement`;
  }

  remove(id: number) {
    return `This action removes a #${id} movement`;
  }


   // Métodos de validación
   async validatePayment(idPayment: number, manager: EntityManager): Promise<Treasury_Payments> {
    const payment = await manager.findOne(Treasury_Payments, { where: { id: idPayment } });
    if (!payment) {
      
      throw new HttpException(`Payment with ID ${idPayment} not found`, 404);
    }
    console.log("SE ENCONTRÓ EL PAGO",payment)
    return payment;
  }

  private async validateTypeOfMovement(type: string, manager: EntityManager): Promise<Treasury_TypeOfMovement> {
    console.log("Iniciando validación del tipo de movimiento...");
    const movementType = await manager.findOne(Treasury_TypeOfMovement, { where: { type_of_movement: type } });
    if (!movementType) {
      console.log("No se encontró el tipo de movimiento");
      throw new HttpException('El tipo de movimiento no existe', 404);
    }
    console.log("Se encontró el tipo de movimiento:", movementType);
    return movementType;
  }

  private async validateAmount(amount: number) {
    if (amount < 0) {
      throw new HttpException('El monto no es válido', 400);
    }
    console.log("SE VALIDÓ EL MONTO",amount)
    return amount
  }

  private async validateUser(userId: number) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new HttpException('El usuario no es válido o no existe', 400);
    }
    console.log(" se validó el usuario",user)
    return user;
 
    
     }
    

}
