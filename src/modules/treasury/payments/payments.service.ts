import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Treasury_Payments } from './entities/payment.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Treasury_maintenance_Money } from '../maintenance/money/entities/money.entity';
import { Provider } from 'src/modules/masters/providers/entities/provider.entity';
import { UsersService } from 'src/modules/config/users/users.service';
import { User } from 'src/modules/config/users/entities/user.entity';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { Http } from 'winston/lib/winston/transports';
import { CorrelativeService } from 'src/modules/config/correlative/correlative.service';
import { MovementsService } from '../movements/movements.service';
import { CashierConfigService } from '../maintenance/cashier_config/cashier_config.service';
import { CashierConfig } from '../maintenance/cashier_config/entities/cashier_config.entity';
import Decimal from 'decimal.js';

interface BalanceEntity {
  id: number;
  balance: number;
  blockedBalance: number
}

@Injectable()
export class PaymentsService {
  constructor(
    private usersService: UsersService,
    //private usersService: UsersService,
    @InjectRepository(Treasury_Payments)  // Inyectar el repositorio
    private paymentsRepository: Repository<Treasury_Payments>,
    @InjectRepository(Treasury_maintenance_Money)  // Inyectar el repositorio
    private moneyRepository: Repository<Treasury_maintenance_Money>,
    private dataSource: DataSource,

    @Inject(forwardRef(() => MovementsService))
    private movementService: MovementsService,
    private correlativeService: CorrelativeService,

    private registerCashiersService: CashierConfigService,

  ) { }


  //Fun
  async create(createPaymentDto: CreatePaymentDto, userId: number): Promise<object> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      //crea el body 
      const newPayment = await this.buildPaymentFromDto(createPaymentDto, userId, queryRunner);

      //crea
      await queryRunner.manager.save(Treasury_Payments, newPayment);

      //verificar si genera un movimiento o no
      await this.handlePaymentStatus(newPayment, Number(createPaymentDto.paymentStatus), userId, queryRunner);

      //restar o bloquear saldo
      await this.handleSubtractOrBlockBalance(newPayment.id, queryRunner, true)

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: 'Pago creado exitosamente',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof HttpException) {
        throw error;
      } else {
        console.error('Error al crear el pago:', error);
        throw new HttpException('Error al crear el pago', 500);
      }
    } finally {
      await queryRunner.release();
    }
  }


  
  async update(id: number, updatePaymentDto: UpdatePaymentDto, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {


      // Busca el usuario que realiza la actualización
      const user = await this.usersService.findOne(userId);

      // Verifica si el pago puede ser editado
      await this.checkIfPaymentIsEditable(id);

      // Parsear el proveedor si es nulo
      await this.parseProvider(updatePaymentDto);

      // Construir el objeto de actualización
      const updateData: Partial<Treasury_Payments> = {
        ...updatePaymentDto,
        balance: updatePaymentDto.amountPaid,
        userUpdate: user,
      };


      // Actualizar el registro de pago
      await queryRunner.manager.update(Treasury_Payments, { id }, updateData);

      // Recupera el registro actualizado
      const updatedPayment = await this.findOne(id);

   
      // Ajustar el balance basado en el estado del pago 
      await this.handleSubtractOrBlockBalance(updatedPayment.id, queryRunner, false)
   
      
      // Generar movimiento de ser necesario
      await this.handlePaymentStatus(updatedPayment, Number(updatePaymentDto.paymentStatus), userId, queryRunner);

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: 'Pago editado exitosamente',
      };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, error.status || 500);
    } finally {
      await queryRunner.release();
    }
  }



  //Notarás aquí el uso de Decimal.js que puede volver algo engorroso el operar con los números, pero es necesario a fines de 
  //mantener una precisión correcta, sobretodo al trabajar con datos financieros
  private async handleSubtractOrBlockBalance(
    paymentId: number,
    queryRunner: QueryRunner,
    isCreating: boolean,
  ): Promise<void> {

    // Obtener el pago dentro de la transacción
    const payment = await queryRunner.manager.findOne(Treasury_Payments, {
      where: { id: paymentId },
      relations: [
        'typeOfPerson',
        'type_of_document',
        'type_of_identification',
        'provider_who_gets_the_payment',
        'currencyUsed',
        'payment_method',
        'user',
        'userUpdate',
        'bankEmissor',
        'bankReceptor',
        'transfer_account_number',
        'paymentStatus',
        'registerCashier',
        'movementGenerated',
      ],
    });

    if (!payment) {
      throw new HttpException("Pago no encontrado", 404);
    }

    console.log('Payment:', payment);


    // Obtener la entidad de balance asociada al pago caja/cuenta/zelle
    const balanceEntity = await this.getBalanceEntityFromPayment(payment);

    if (!balanceEntity) {
      throw new HttpException("Entidad de balance no encontrada", 404);
    }

    // Ajustar el balance basado en el estado del pago 
    await this.adjustBalance(balanceEntity, payment.amountPaid, payment.paymentStatus.id, isCreating);

    // Guardar la entidad actualizada dentro de la transacción
    await queryRunner.manager.save(balanceEntity);


  }

  /**
   * Obtiene la entidad de balance asociada al pago.
   * Puede ser una caja registradora, cuenta bancaria, etc.
   * @param payment El objeto de pago
   * @returns La entidad de balance asociada al pago
   */
  private async getBalanceEntityFromPayment(payment: Treasury_Payments): Promise<BalanceEntity> {
    if (payment.registerCashier) {
      // Pago en efectivo, obtener la caja registradora
      const cashier = await this.registerCashiersService.findOne(payment.registerCashier.id);
      console.log("Caja involucrada en el pago:", cashier);
      return cashier;
    }
    // TODO: Manejar otros métodos de pago (ejemplo: cuentas bancarias, Zelle)
    throw new HttpException("Método de pago no soportado", 400);
  }

  /**
   * Ajusta el balance de la entidad basado en el estado del pago.
   * Si el pago está confirmado, resta el monto del balance.
   * Si el pago no está confirmado, bloquea el monto restándolo del balance y agregándolo al saldo bloqueado.
   * @param balanceEntity La entidad cuyo balance será ajustado
   * @param amountPaid El monto pagado en el pago
   * @param paymentStatusId El ID del estado del pago
   */
  private async adjustBalance(
    balanceEntity: BalanceEntity,
    amountPaid: number,
    paymentStatusId: number,
    isCreating: boolean
  ): Promise<void> {

    const balance = new Decimal(balanceEntity.balance);
    const amount = new Decimal(amountPaid);

    console.log("el iscreating", isCreating)
    console.log("el balance entity", balanceEntity)
    console.log(" el payment status id",paymentStatusId)

    if (paymentStatusId === 2 && isCreating === true) {
      // El pago está confirmado y se está creando, restar el monto del balance
      const newBalance = balance.minus(amount);

      if (newBalance.isNegative()) {
        // No puede tener balance negativo
        throw new HttpException("El monto es mayor a lo disponible en la entidad", 400);
      }

      // Actualizar el balance
      balanceEntity.balance = newBalance.toNumber();
      console.log("Se restó el balance.");

    } else if (paymentStatusId === 1 && isCreating === true) {
      // El pago se está creando, no está confirmado, bloquear el monto y restarlo al original
      const blockedBalance = new Decimal(balanceEntity.blockedBalance);
      const newBalance = balance.minus(amount);

      if (newBalance.isNegative()) {
        // No puede bloquear más de lo disponible
        throw new HttpException("No se puede bloquear más saldo del disponible", 400);
      }

      // Actualizar el balance y el saldo bloqueado
      balanceEntity.balance = newBalance.toNumber();
      balanceEntity.blockedBalance = blockedBalance.plus(amount).toNumber();

      console.log("Se bloqueó y restó el saldo.");
    }

    else if (paymentStatusId === 2 && isCreating === false) {

      // El pago se confirmó y se está editando, restar el monto del pago al balance bloqueado

      const blockedBalance = new Decimal(balanceEntity.blockedBalance);

      console.log("el blaance bloqueado",blockedBalance)

      var newBlockedBalance = blockedBalance.minus(amount)

      console.log("el new blocked balance",newBlockedBalance)

      if(newBlockedBalance.isNegative()){
        throw new HttpException("No se pudo actualizar el pago, pues al intentar liberar el balance bloqueado, el nuevo balance bloqueado resultó negativo ",400)
      }

      balanceEntity.blockedBalance = newBlockedBalance.toNumber()

      console.log("liberé saldo bloqueado")
    }



  }


  private async buildPaymentFromDto(
    createPaymentDto: CreatePaymentDto,
    userId: number,
    queryRunner: QueryRunner,
  ): Promise<Treasury_Payments> {
    const newPayment = new Treasury_Payments();

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new HttpException('Usuario no encontrado', 400);
    }

    // Información básica
    newPayment.type_of_identification = createPaymentDto.type_of_identification;
    newPayment.type_of_document = createPaymentDto.type_of_document;
    newPayment.document_of_counterparty = createPaymentDto.document_of_counterparty;
    newPayment.name_of_counterparty = createPaymentDto.name_of_counterparty;

    // Información del proveedor
    if (createPaymentDto.provider_who_gets_the_payment) {
      const provider = await queryRunner.manager.findOne(Provider, {
        where: { id: createPaymentDto.provider_who_gets_the_payment },
      });
      if (!provider) {
        newPayment.provider_who_gets_the_payment
      }
      newPayment.provider_who_gets_the_payment = provider;
    }

    // Información del pago
    newPayment.currencyUsed = createPaymentDto.currencyUsed;
    newPayment.paymentDate = createPaymentDto.paymentDate;
    newPayment.payment_method = createPaymentDto.payment_method;
    newPayment.amountPaid = createPaymentDto.amountPaid;
    newPayment.balance = createPaymentDto.amountPaid;
    newPayment.paymentReference = createPaymentDto.paymentReference;
    newPayment.voucher_image_url = createPaymentDto.file;

    // Campos genéricos
    newPayment.user = user;
    newPayment.isActive = true;
    newPayment.paymentStatus = createPaymentDto.paymentStatus;

    // Manejar datos específicos según el método de pago
    await this.handlePaymentMethodData(createPaymentDto, newPayment);

    // Generar código correlativo
    newPayment.correlativeCode = await this.correlativeService.generateCode('TRE', 'emitted_payments');

    return newPayment;
  }

  private async handlePaymentMethodData(
    createPaymentDto: CreatePaymentDto,
    newPayment: Treasury_Payments,
  ): Promise<void> {
    const paymentMethod = createPaymentDto.payment_method;

    if (!paymentMethod) {
      throw new HttpException('Método de pago no especificado', 400);
    }

    switch (paymentMethod) {
      case 1: // Tarjeta de Crédito
      case 2: // Tarjeta de Débito
        this.handleCreditOrDebitPayment(createPaymentDto, newPayment);
        break;
      case 3: // Transferencia Bancaria
      case 9: // Otra Transferencia Bancaria
        this.handleBankTransferPayment(createPaymentDto, newPayment);
        break;
      case 4: // Pago Móvil
        this.handlePagoMovilPayment(createPaymentDto, newPayment);
        break;
      case 5: // PayPal
      case 8: // Zelle
        this.handlePayPalOrZellePayment(createPaymentDto, newPayment);
        break;
      case 6: // Efectivo
        this.handleCashPayment(createPaymentDto, newPayment);
        break;
      default:
        throw new HttpException('Método de pago no válido', 400);
    }
  }

  private handleCreditOrDebitPayment(
    createPaymentDto: CreatePaymentDto,
    newPayment: Treasury_Payments,
  ): void {
    if (createPaymentDto.bankEmissor && createPaymentDto.transfer_account_number) {
      newPayment.bankEmissor = createPaymentDto.bankEmissor;
      newPayment.transfer_account_number = createPaymentDto.transfer_account_number;
    }
    newPayment.bankReceptor = null;
  }

  private handleBankTransferPayment(
    createPaymentDto: CreatePaymentDto,
    newPayment: Treasury_Payments,
  ): void {
    const requiredFields = [
      'transfer_account_number_of_receiver',
      'bankEmissor',
      'bankReceptor',
      'transfer_account_number',
    ];

    for (const field of requiredFields) {
      if (!createPaymentDto[field]) {
        throw new HttpException(`Falta el campo ${field} para la transferencia bancaria`, 400);
      }
    }

    newPayment.transfer_account_number_of_receiver = createPaymentDto.transfer_account_number_of_receiver;
    newPayment.bankEmissor = createPaymentDto.bankEmissor;
    newPayment.bankReceptor = createPaymentDto.bankReceptor;
    newPayment.transfer_account_number = createPaymentDto.transfer_account_number;
  }

  private handlePagoMovilPayment(
    createPaymentDto: CreatePaymentDto,
    newPayment: Treasury_Payments,
  ): void {
    const requiredFields = [
      'bankEmissor',
      'bankReceptor',
      'pagomovilDocument',
      'pagomovilPhoneNumber',
    ];

    for (const field of requiredFields) {
      if (!createPaymentDto[field]) {
        throw new HttpException(`Falta el campo ${field} para el pago móvil`, 400);
      }
    }

    newPayment.bankEmissor = createPaymentDto.bankEmissor;
    newPayment.bankReceptor = createPaymentDto.bankReceptor;
    newPayment.pagomovilDocument = createPaymentDto.pagomovilDocument;
    newPayment.pagomovilPhoneNumber = createPaymentDto.pagomovilPhoneNumber;
  }

  private handlePayPalOrZellePayment(
    createPaymentDto: CreatePaymentDto,
    newPayment: Treasury_Payments,
  ): void {
    if (createPaymentDto.payment_method === 8 && !createPaymentDto.addressee_name) {
      throw new HttpException('Falta el nombre del destinatario para Zelle', 400);
    }

    if (!createPaymentDto.emailReceptor || !createPaymentDto.emailEmisor) {
      throw new HttpException('Faltan datos para el pago vía PayPal o Zelle', 400);
    }

    if (createPaymentDto.payment_method === 8) {
      newPayment.addressee_name = createPaymentDto.addressee_name;
    }

    newPayment.emailReceptor = createPaymentDto.emailReceptor;
    newPayment.emailEmisor = createPaymentDto.emailEmisor;
  }

  private handleCashPayment(
    createPaymentDto: CreatePaymentDto,
    newPayment: Treasury_Payments,
  ): void {
    if (!createPaymentDto.registerCashier) {
      throw new HttpException('Faltan datos para la caja registradora', 400);
    }
    newPayment.registerCashier = createPaymentDto.registerCashier;
  }

  private async handlePaymentStatus(
    newPayment: Treasury_Payments,
    paymentStatus: number,
    userId: number,
    queryRunner: QueryRunner,
  ): Promise<void> {

    //console.log("el payment status que estoy recdibiendo",paymentStatus)

    if (isNaN(paymentStatus)) {
      throw new HttpException('Verificando el payment status no se recibió un número', 400);
    }

    //vino comprobado, se genera un movimiento
    if (paymentStatus === 2) {
      const movementCreated = await this.movementService.create(
        {
          idPayment: newPayment.id,
          type_of_movement: 'EGRESO',
          amount: newPayment.amountPaid,
          userId,
        },
        queryRunner.manager,
      );

      if (!movementCreated.success) {
        throw new HttpException('No se pudo generar el movimiento para registrar el pago', 500);
      }
    }
  }




  async findAll(
    query: any,
  ): Promise<{ totalRows: number; data: Treasury_Payments[] }> {

    const take = query.rows || 5;
    const skip = query.page ? (query.page - 1) * take : 0;
    const order = query.order || 'DESC';

    const queryBuilder = this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.typeOfPerson', 'typeOfPerson')
      .leftJoinAndSelect('payment.type_of_document', 'documentType')
      .leftJoinAndSelect('payment.type_of_identification', 'identificationType')
      .leftJoinAndSelect('payment.provider_who_gets_the_payment', 'provider')
      .leftJoinAndSelect('payment.currencyUsed', 'currencyUsed')
      .leftJoinAndSelect('payment.payment_method', 'paymentMethod')
      .leftJoinAndSelect('payment.user', 'user')
      .leftJoinAndSelect('payment.userUpdate', 'userUpdate')
      .leftJoinAndSelect('payment.bankEmissor', 'bankEmissor')
      .leftJoinAndSelect('payment.bankReceptor', 'bankReceptor')
      .leftJoinAndSelect('payment.transfer_account_number', 'transfer_account_number')
      .leftJoinAndSelect('payment.paymentStatus', 'paymentStatus')
      .leftJoinAndSelect('payment.registerCashier', 'registerCashier')
      .leftJoinAndSelect('payment.movementGenerated', 'movementGenerated')
      .leftJoinAndSelect('movementGenerated.type_of_movement', 'movementType')

    // Filtros condicionales
    if (query.typeOfPerson) {
      queryBuilder.andWhere('typeOfPerson.id = :typeOfPerson', {
        typeOfPerson: query.typeOfPerson,
      });
    }
    if (query.documentType) {
      queryBuilder.andWhere('documentType.id = :documentType', {
        documentType: query.documentType,
      });
    }
    if (query.identificationType) {
      queryBuilder.andWhere('identificationType.id = :identificationType', {
        identificationType: query.identificationType,
      });
    }
    if (query.providerId) {
      queryBuilder.andWhere('provider.id = :providerId', {
        providerId: query.providerId,
      });
    }
    if (query.paymentMethod) {
      queryBuilder.andWhere('paymentMethod.id LIKE :paymentMethod', {
        paymentMethod: `%${query.paymentMethod}%`,
      });
    }
    if (query.isActive !== undefined) {
      const isActive = query.isActive === 'true'; // Convertir la cadena a booleano
      queryBuilder.andWhere('payment.isActive = :isActive', { isActive: isActive });
    }
    if (query.paymentDate) {
      const [startDate, endDate] = query.paymentDate.split(',');
      queryBuilder.andWhere('payment.paymentDate BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }
    if (query.createdAt) {
      const [startDate, endDate] = query.createdAt.split(',');
      queryBuilder.andWhere('payment.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }


    if (query.name_of_counterparty) {
      queryBuilder.andWhere('payment.name_of_counterparty LIKE :name_of_counterparty', {
        name_of_counterparty: `%${query.name_of_counterparty}%`,
      });
    }

    if (query.document_of_counterparty) {
      queryBuilder.andWhere('payment.document_of_counterparty LIKE :document_of_counterparty', {
        document_of_counterparty: `%${query.document_of_counterparty}%`,
      });
    }

    if (query.currencyUsed) {
      queryBuilder.andWhere('currencyUsed.money LIKE :currencyUsed', {
        currencyUsed: query.currencyUsed,
      });
    }

    if (query.payment_method) {
      queryBuilder.andWhere('LOWER(paymentMethod.method) LIKE LOWER(:searchedMethod)', {
        searchedMethod: `%${query.payment_method}%`,
      });
    }


    async function andWhereLike(builder: any, searchedValue: any, entityReference: any, campSearched: any) {
      builder.andWhere(`CAST(${entityReference}.${campSearched} AS CHAR) LIKE :alias`, {
        alias: `%${searchedValue}%`
      });
      return builder;
    }

    if (query.paymentStatus) {

      queryBuilder.andWhere('paymentStatus.status LIKE :alias', {
        alias: `%${query.paymentStatus}%`,
      });

      //await andWhereLike(queryBuilder, query.paymentStatus, "payment", "paymentStatus")
    }


    if (query.paymentReference) {
      await andWhereLike(queryBuilder, query.paymentReference, "payment", "paymentReference")
    }

    if (query.amountPaid) {
      await andWhereLike(queryBuilder, query.amountPaid, "payment", "amountPaid")
    }



    const [totalRows, data] = await Promise.all([
      queryBuilder.getCount(),
      query?.export
        ? queryBuilder.orderBy('payment.id', order).getMany()
        : queryBuilder.orderBy('payment.id', order).skip(skip).take(take).getMany(),
    ]);

    //  console.log(totalRows, data)

    return { totalRows, data };
  }




  async findOne(id: number): Promise<Treasury_Payments> {
    try {
      const payment = await this.paymentsRepository.findOne({
        where: { id },
        relations: [
          'typeOfPerson',
          'type_of_document',
          'type_of_identification',
          'provider_who_gets_the_payment',
          'currencyUsed',
          'payment_method',
          'user',
          'userUpdate',
          'bankEmissor',
          'bankReceptor',
          'transfer_account_number',
          'paymentStatus',
          'registerCashier',
          'movementGenerated',
        ],
      });

      if (!payment) {
        throw new HttpException(`Payment with ID ${id} not found`, 404);
      }

      return payment;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }


  private async checkIfPaymentIsEditable(id: number) {

    // Busca el pago antes de intentar actualizarlo
    const existingPayment = await this.findOne(id);

    // Verifica si el estado del pago es 'confirmado' (status.id = 2)
    if (existingPayment.paymentStatus.id === 2) {
      throw new HttpException("El pago no se puede editar, pues está confirmado", 400);
    }

  }

  private async parseProvider(dtoBody: UpdatePaymentDto) {

    if (dtoBody.provider_who_gets_the_payment === "null") {
      dtoBody.provider_who_gets_the_payment = null
    }

  }





  async changeStatus(id: number): Promise<string | Error> {


    console.log("cambiando status")

    // Encuentra el pago por su ID
    const payment = await this.paymentsRepository.findOne({ where: { id } });

    if (!payment) {
      throw new HttpException(`Payment with ID ${id} not found`, 404);
    }

    // Cambia el estatus de activo a inactivo o viceversa
    payment.isActive = !payment.isActive;

    try {
      // Guarda el estado actualizado
      await this.paymentsRepository.save(payment);
      return '¡Cambio de estatus realizado con éxito!';
    } catch (error) {
      console.error('Error al cambiar el estatus:', error);
      throw new HttpException('Error al cambiar el estatus del pago', 500);
    }
  }



  async exportDataToExcel(data: any[], res: Response): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    worksheet.addRow(['Pagos Emitidos']);
    worksheet.columns = [
      { header: 'Fecha de Creación', key: 'createdAt', width: 25 },
      { header: 'Nombre de Contraparte:', key: 'name', width: 20 },
      { header: 'Identificacion de Contraparte:', key: 'identification', width: 20 },
      { header: 'Moneda usada', key: 'currency', width: 20 },
      { header: 'Método de Pago', key: 'paymentMethod', width: 20 },
      { header: 'Referencia de Pago', key: 'reference', width: 20 },
      { header: 'Monto', key: 'amount', width: 20 },
      { header: 'Fecha de Pago', key: 'paymentDate', width: 20 },
      { header: 'Número de Cuenta de Receptor', key: 'accountNumberOfReceiver', width: 50 },
      { header: 'Documento de receptor para Pago Movil', key: 'documentophonen', width: 50 },
      { header: 'Teléfono de receptor para Pago Movil', key: 'pagomovilphonen', width: 50 },
      { header: 'Email de contraparte', key: 'emailReceptor', width: 30 },
      { header: 'Email usado', key: 'emailEmisor', width: 30 },
      { header: 'Nombre de Receptor para Zelle', key: 'addressee_name', width: 20 },
      { header: 'Cuenta Utilizada para realizar la Transferencia', key: 'transfer_account_number', width: 20 },
      { header: 'Banco Emisor', key: 'bankEmissor', width: 20 },
      { header: 'Banco Receptor', key: 'bankReceptor', width: 20 },
      { header: 'Registrado por', key: 'user', width: 20 },
    ];

    // Aplicar estilos a la cabecera
    worksheet.getRow(2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '2a953d' },
    };
    worksheet.getRow(2).font = { bold: true };
    worksheet.getRow(2).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(2).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    // Agregar datos y aplicar estilos
    data.forEach((item) => {
      const flattenedItem = {
        createdAt: item.createdAt,

        exchangeToCurrency: item.exchangeToCurrency ? item.exchangeToCurrency.money : '',
        name: item.name_of_counterparty ? item.name_of_counterparty : '',
        identification: item.document_of_counterparty ? item.document_of_counterparty : "",
        currency: item.currencyUsed.money ? item.currencyUsed.money : "",
        paymentMethod: item.payment_method ? item.payment_method.method : "",
        reference: item.paymentReference ? item.paymentReference : "",
        amount: item.amountPaid ? item.amountPaid : "",
        paymentDate: item.paymentDate ? item.paymentDate : "",
        accountNumberOfReceiver: item.transfer_account_number_of_receiver ? item.transfer_account_number_of_receiver : "",
        pagomovilphonen: item.pagomovilPhoneNumber ? item.pagomovilPhoneNumber : "",
        documentophonen: item.pagomovilDocument ? item.pagomovilDocument : "",
        emailReceptor: item.emailReceptor ? item.emailReceptor : "",
        emailEmisor: item.emailEmisor ? item.emailEmisor : "",
        addressee_name: item.addressee_name ? item.addressee_name : "",
        transfer_account_number: item.transfer_account_number ? item.transfer_account_number.nameAccount : "",
        bankEmissor: item.bankEmissor ? item.bankEmissor.name : "",
        bankReceptor: item.bankReceptor ? item.bankReceptor.name : "",
        user: item.user.name,
      };

      const row = worksheet.addRow(flattenedItem);

      row.alignment = { vertical: 'middle', horizontal: 'left' };
      row.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Configurar el encabezado de la respuesta HTTP
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');

    // Escribir el libro de trabajo en la respuesta HTTP
    await workbook.xlsx.write(res);
    res.end();
  }





  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
