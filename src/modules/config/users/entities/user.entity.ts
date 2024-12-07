import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { Action } from '../../actions/entities/action.entity';
import { Application } from '../../applications/entities/application.entity';
import { Package } from '../../packages/entities/package.entity';
import { Page } from '../../pages/entities/page.entity';
import { Status } from '../../status/entities/status.entity';
import { PrinterBrand } from '../../printer_brands/entities/printer_brand.entity';
import { PrinterType } from '../../printer_types/entities/printer_type.entity';
import { PrinterModel } from '../../printer_models/entities/printer_model.entity';
import { Printer } from '../../printers/entities/printer.entity';
import { CashierType } from '../../cashier_types/entities/cashier_type.entity';
import { Cashier } from '../../cashiers/entities/cashier.entity';
import { State } from 'src/modules/masters/states/entities/state.entity';
import { City } from 'src/modules/masters/cities/entities/city.entity';
import { DocumentType } from 'src/modules/masters/document-types/entities/document-type.entity';
import { ClientType } from 'src/modules/masters/client-types/entities/client-type.entity';
import { TaxpayerType } from 'src/modules/masters/taxpayer-types/entities/taxpayer-type.entity';
import { Client } from 'src/modules/masters/clients/entities/client.entity';
import { Provider } from 'src/modules/masters/providers/entities/provider.entity';
import { IdentificationType } from 'src/modules/masters/identification-types/entities/identification-type.entity';
import { Treasury_maintenance_Money } from 'src/modules/treasury/maintenance/money/entities/money.entity';
import { Treasury_maintenance_Bank } from 'src/modules/treasury/maintenance/banks/entities/bank.entity';
import { Treasury_maintenance_PaymentMethod } from 'src/modules/treasury/maintenance/payment_method/entities/payment_method.entity';
import { Treasury_maintenance_Account } from 'src/modules/treasury/maintenance/account/entities/account.entity';
import { Treasury_maintenance_Tax } from 'src/modules/treasury/maintenance/taxes/entities/tax.entity';
import { config_admistrative_paymentConcept } from 'src/modules/audits/payment_concepts/entities/payment_concept.entity';
import { RatesOrPorcentage } from 'src/modules/audits/rates_or_porcentage/entities/rates_or_porcentage.entity';
import { TaxUnitsRate } from 'src/modules/audits/tax_units_rate/entities/tax_units_rate.entity';
import { Rates2Range } from 'src/modules/audits/rates2_ranges/entities/rates2_range.entity';
import { Config_Module } from '../../module/entities/module.entity';
import { TaxRateSeniat } from '../../../audits/tax-rate-seniat/entities/tax-rate-seniat.entity';
import { DebitNote } from 'src/modules/purchasing/debit-note/entities/debit-note.entity';
import { purchasing_creditNote } from 'src/modules/purchasing/creditNote/entities/creditNote.entity';
import { CashierConfig } from 'src/modules/treasury/maintenance/cashier_config/entities/cashier_config.entity';
import { DebitNoteSale } from 'src/modules/sales/debit-note-sales/entities/debit-note-sale.entity';
import { CreditNotSale } from 'src/modules/sales/credit-not-sales/entities/credit-not-sale.entity';
import { Treasury_Movements } from 'src/modules/treasury/movements/entities/movement.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: true })
    isActive: boolean;

    // @Column({ type: 'int', nullable: true })
    // profileId?: number;

    @ManyToOne(() => Profile, (profile) => profile.id)
    profile: Profile;

    @CreateDateColumn()
    createdAt: Date; // Creation date

    @UpdateDateColumn({ nullable: true })
    updatedAt?: Date; // Last updated date

    @OneToMany(() => Action, (action) => action.user)
    actions: Action[];

    @OneToMany(() => Action, (action) => action.userUpdate)
    actionsUpdated: Action[];

    @OneToMany(() => Application, (application) => application.user)
    applications: Application[];

    @OneToMany(() => Application, (application) => application.userUpdate)
    applicationsUpdated: Application[];

    @OneToMany(() => Package, (packAge) => packAge.user)
    packages: Package[];

    @OneToMany(() => Package, (packAge) => packAge.userUpdate)
    packagesUpdated: Package[];

    @OneToMany(() => Page, (page) => page.user)
    pages: Page[];

    @OneToMany(() => Page, (page) => page.userUpdate)
    pagesUpdated: Page[];

    @OneToMany(() => Page, (page) => page.user)
    profiles: Page[];

    @OneToMany(() => Page, (page) => page.userUpdate)
    profilesUpdated: Page[];

    @OneToMany(() => Status, (statuses) => statuses.user)
    statuses: Status[];

    @OneToMany(() => Treasury_maintenance_Money, (moneys) => moneys.user)
    moneys: Treasury_maintenance_Money[];

    @OneToMany(() => Treasury_maintenance_Money, (moneysUpdated) => moneysUpdated.userUpdate)
    moneysUpdated: Treasury_maintenance_Money[];

    @OneToMany(() => Treasury_maintenance_Bank, (banks) => banks.user)
    banks: Treasury_maintenance_Bank[];

    @OneToMany(() => Treasury_maintenance_Bank, (banksUpdated) => banksUpdated.userUpdate)
    banksUpdated: Treasury_maintenance_Bank[];

    @OneToMany(() => Treasury_maintenance_Tax, (taxs) => taxs.user)
    taxs: Treasury_maintenance_Tax[];

    @OneToMany(() => Treasury_maintenance_Tax, (taxsUpdated) => taxsUpdated.userUpdate)
    taxsUpdated: Treasury_maintenance_Tax[];

    @OneToMany(() => Treasury_maintenance_Account, (account) => account.user)
    account: Treasury_maintenance_Account[];

    @OneToMany(() => Treasury_maintenance_Account, (accountUpdated) => accountUpdated.userUpdate)
    accountUpdated: Treasury_maintenance_Account[];

    @OneToMany(() => config_admistrative_paymentConcept, (paymentConcept) => paymentConcept.user)
    paymentConcept: config_admistrative_paymentConcept[];

    @OneToMany(
        () => config_admistrative_paymentConcept,
        (paymentConceptUpdated) => paymentConceptUpdated.userUpdate,
    )
    paymentConceptUpdated: config_admistrative_paymentConcept[];

    @OneToMany(() => RatesOrPorcentage, (ratesOrPorcentage) => ratesOrPorcentage.user)
    ratesOrPorcentage: RatesOrPorcentage[];

    @OneToMany(
        () => RatesOrPorcentage,
        (ratesOrPorcentageUpdated) => ratesOrPorcentageUpdated.userUpdate,
    )
    ratesOrPorcentageUpdated: RatesOrPorcentage[];

    @OneToMany(() => Treasury_maintenance_PaymentMethod, (paymentMethod) => paymentMethod.user)
    paymentMethod: Treasury_maintenance_PaymentMethod[];

    @OneToMany(
        () => Treasury_maintenance_PaymentMethod,
        (paymentMethodUpdated) => paymentMethodUpdated.userUpdate,
    )
    PaymentMethodUpdated: Treasury_maintenance_PaymentMethod[];

    @OneToMany(() => Config_Module, (configModule) => configModule.user)
    configModule: Config_Module[];

    @OneToMany(() => Config_Module, (configModuleUpdated) => configModuleUpdated.userUpdate)
    configModuleUpdated: Config_Module[];

    @OneToMany(() => Status, (statusesUpdated) => statusesUpdated.userUpdate)
    statusesUpdated: Status[];

    @OneToMany(() => PrinterBrand, (printerBrand) => printerBrand.user)
    printerBrands: PrinterBrand[];

    @OneToMany(() => PrinterBrand, (printerBrand) => printerBrand.userUpdate)
    printerBrandsUpdated: PrinterBrand[];

    @OneToMany(() => PrinterType, (printerType) => printerType.user)
    printerTypes: PrinterType[];

    @OneToMany(() => PrinterType, (printerType) => printerType.userUpdate)
    printerTypesUpdated: PrinterType[];

    @OneToMany(() => PrinterModel, (printerModel) => printerModel.user)
    printerModels: PrinterModel[];

    @OneToMany(() => PrinterModel, (printerModel) => printerModel.userUpdate)
    printerModelsUpdated: PrinterModel[];

    @OneToMany(() => Printer, (printer) => printer.user)
    printers: Printer[];

    @OneToMany(() => Printer, (printer) => printer.userUpdate)
    printersUpdated: Printer[];

    @OneToMany(() => CashierType, (cashierType) => cashierType.user)
    cashierTypes: CashierType[];

    @OneToMany(() => CashierType, (cashierType) => cashierType.userUpdate)
    cashierTypesUpdated: CashierType[];

    @OneToMany(() => Cashier, (cashier) => cashier.user)
    cashiers: Cashier[];

    @OneToMany(() => Cashier, (cashier) => cashier.userUpdate)
    cashiersUpdated: Cashier[];

    @OneToMany(() => State, (state) => state.user)
    states: State[];

    @OneToMany(() => State, (state) => state.userUpdate)
    statesUpdated: State[];

    @OneToMany(() => City, (city) => city.user)
    cities: City[];

    @OneToMany(() => City, (city) => city.userUpdate)
    citiesUpdated: City[];

    //guardar imagenes de perfil
    @Column({ nullable: true })
    filePath?: string; //puede ser nulo

    @Column()
    fullName: string;

    @Column()
    phoneNumber: string;

    @Column()
    dni: string;

    //campos para reiniciar password
    @Column({ nullable: true })
    resetToken: string;

    @Column({ nullable: true })
    resetTokenExpiration: Date;

    @OneToMany(() => DocumentType, (documentType) => documentType.user)
    documentTypes: DocumentType[];

    @OneToMany(() => DocumentType, (documentType) => documentType.userUpdate)
    documentTypesUpdated: DocumentType[];

    @OneToMany(() => TaxRateSeniat, (taxRateSeniat) => taxRateSeniat.user)
    taxRateSeniat: TaxRateSeniat[];

    @OneToMany(() => TaxRateSeniat, (taxRateSeniat) => taxRateSeniat.userUpdate)
    taxRateSeniatUpdated: TaxRateSeniat[];

    @OneToMany(() => ClientType, (clientType) => clientType.user)
    clientTypes: ClientType[];

    @OneToMany(() => ClientType, (clientType) => clientType.userUpdate)
    clientTypesUpdated: ClientType[];

    @OneToMany(() => TaxpayerType, (taxpayerType) => taxpayerType.user)
    taxpayerTypes: TaxpayerType[];

    @OneToMany(() => TaxpayerType, (taxpayerType) => taxpayerType.userUpdate)
    taxpayerTypesUpdated: TaxpayerType[];

    @OneToMany(() => DebitNote, (debitNote) => debitNote.user)
    debitNote: DebitNote[];

    @OneToMany(() => DebitNote, (debitNote) => debitNote.userUpdate)
    debitNoteUpdated: DebitNote[];

    @OneToMany(() => CreditNotSale, (creditNotSale) => creditNotSale.user)
    CreditNotSale: CreditNotSale[];

    @OneToMany(() => CreditNotSale, (creditNotSale) => creditNotSale.userUpdate)
    CreditNotSaleUpdated: CreditNotSale[];

    @OneToMany(() => DebitNoteSale, (debitNoteSale) => debitNoteSale.user)
    debitNoteSale: DebitNoteSale[];

    @OneToMany(() => DebitNoteSale, (debitNoteSale) => debitNoteSale.userUpdate)
    debitNoteSaleUpdated: DebitNoteSale[];

    @OneToMany(() => CashierConfig, (cashierConfig) => cashierConfig.user)
    cashierConfig: CashierConfig[];

    @OneToMany(() => CashierConfig, (cashierConfig) => cashierConfig.userUpdate)
    cashierConfigUpdated: CashierConfig[];

    @OneToMany(() => purchasing_creditNote, (purchasing_creditNote) => purchasing_creditNote.user)
    purchasing_creditNote: purchasing_creditNote[];

    @OneToMany(() => DebitNote, (purchasing_creditNote) => purchasing_creditNote.userUpdate)
    purchasing_creditNoteUpdated: purchasing_creditNote[];

    @OneToMany(() => Client, (client) => client.user)
    clients: Client[];

    @OneToMany(() => Client, (client) => client.userUpdate)
    clientsUpdated: Client[];

    @OneToMany(() => Provider, (provider) => provider.user)
    providers: Provider[];

    @OneToMany(() => Provider, (provider) => provider.userUpdate)
    providersUpdated: Provider[];

    @OneToMany(() => IdentificationType, (identificationType) => identificationType.user)
    identificationTypes: IdentificationType[];

    @OneToMany(() => IdentificationType, (identificationType) => identificationType.userUpdate)
    identificationTypesUpdated: IdentificationType[];

    @OneToMany(() => TaxUnitsRate, (taxUnitsRate) => taxUnitsRate.user)
    taxUnitsRate: TaxUnitsRate[];

    @OneToMany(() => TaxUnitsRate, (taxUnitsRate) => taxUnitsRate.userUpdate)
    taxUnitsRateUpdated: TaxUnitsRate[];

    @OneToMany(() => Rates2Range, (rates2Range) => rates2Range.user)
    rates2Range: Rates2Range[];

    @OneToMany(() => Rates2Range, (rates2Range) => rates2Range.userUpdate)
    rates2RangeUpdated: Rates2Range[];


    @OneToMany(() => Treasury_Movements, (movements) => movements.userUpdate)
    updatedMovements: Treasury_Movements[];

    @OneToMany(() => Treasury_Movements, (movements) => movements.user)
    movementsDone: Treasury_Movements[];
}
