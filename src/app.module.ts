import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbdatasource } from './database/data.source';
// import { ClientsModule as MicroserviceClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { SocketModule } from './socket/socket.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from './modules/config/users/users.module';
import { ActionsModule } from './modules/config/actions/actions.module';
import { StatusModule } from './modules/config/status/status.module';
import { PackagesModule } from './modules/config/packages/packages.module';
import { ApplicationsModule } from './modules/config/applications/applications.module';
import { PagesModule } from './modules/config/pages/pages.module';
import { ProfilesModule } from './modules/config/profiles/profiles.module';
import { CompaniesModule } from './modules/config/companies/companies.module';
import { PrinterBrandsModule } from './modules/config/printer_brands/printer_brands.module';
import { PrinterTypesModule } from './modules/config/printer_types/printer_types.module';
import { PrinterModelsModule } from './modules/config/printer_models/printer_models.module';
import { PrintersModule } from './modules/config/printers/printers.module';
import { CashierTypesModule } from './modules/config/cashier_types/cashier_types.module';
import { CashiersModule } from './modules/config/cashiers/cashiers.module';
import { StatesModule } from './modules/masters/states/states.module';
import { CitiesModule } from './modules/masters/cities/cities.module';
import { BrandsModule } from './modules/inventory/maintenance/brands/brands.module';
import { MailsModule } from './mails/mails.module';
import { BanksModule } from './modules/treasury/maintenance/banks/banks.module';
import { CategoriesModule } from './modules/inventory/maintenance/categories/categories.module';
import { SubCategoriesModule } from './modules/inventory/maintenance/sub-categories/sub-categories.module';
import { TypesPresentationModule } from './modules/inventory/maintenance/types-presentation/types-presentation.module';
import { UnitsConcentrationModule } from './modules/inventory/maintenance/units-concentration/units-concentration.module';
import { TypesPackagingModule } from './modules/inventory/maintenance/types-packaging/types-packaging.module';
import { UnitsMeasurementModule } from './modules/inventory/maintenance/units-measurement/units-measurement.module';
import { CatalogueModule } from './modules/inventory/catalogue/catalogue.module';
import { MoneyModule } from './modules/treasury/maintenance/money/money.module';
import { ExchangeRateModule } from './modules/audits/exchange_rate/exchange_rate.module';
import { ConcentrationModule } from './modules/inventory/maintenance/concentration/concentration.module';
import { QuantitiesPackageModule } from './modules/inventory/maintenance/quantities-package/quantities-package.module';
import { ScrappingServiceModule } from './modules/treasury/maintenance/scrapping_service/scrapping_service.module';
import { DocumentTypesModule } from './modules/masters/document-types/document-types.module';
import { ClientTypesModule } from './modules/masters/client-types/client-types.module';
import { TaxpayerTypesModule } from './modules/masters/taxpayer-types/taxpayer-types.module';
import { ClientsModule } from './modules/masters/clients/clients.module';
import { ProvidersModule } from './modules/masters/providers/providers.module';
import { IdentificationTypesModule } from './modules/masters/identification-types/identification-types.module';
import { TaxesModule } from './modules/treasury/maintenance/taxes/taxes.module';
import { PaymentMethodModule } from './modules/treasury/maintenance/payment_method/payment_method.module';
import { AccountModule } from './modules/treasury/maintenance/account/account.module';
import { TaxUnitsRateModule } from './modules/audits/tax_units_rate/tax_units_rate.module';
import { Rates2RangesModule } from './modules/audits/rates2_ranges/rates2_ranges.module';
import { PaymentConceptsModule } from './modules/audits/payment_concepts/payment_concepts.module';
import { RatesOrPorcentageModule } from './modules/audits/rates_or_porcentage/rates_or_porcentage.module';
import { TypesPeopleIsrlModule } from './modules/audits/types_people_isrl/types_people_isrl.module';
import { AuthGuard } from './auth/auth.guard';
import { PaymentsModule } from './modules/treasury/payments/payments.module';
import { TypeOfPeopleModule } from './modules/config/type_of_people/type_of_people.module';
import { ReasonModule } from './modules/audits/reason/reason.module';
import { ModuleModule } from './modules/config/module/module.module';
import { ReceivedPaymentsModule } from './modules/treasury/received_payments/received_payments.module';
import { ComissionPerPaymentMethodModule } from './modules/treasury/comission_per_payment_method/comission_per_payment_method.module';
import { InvoiceTypesModule } from './modules/config/invoice_types/invoice_types.module';
import { DiscountTypesModule } from './modules/config/discount_types/discount_types.module';
import { CorrelativeModule } from './modules/config/correlative/correlative.module';
import { CreditNoteModule } from './modules/purchasing/creditNote/creditNote.module';
import { TaxRateSeniatModule } from './modules/audits/tax-rate-seniat/tax-rate-seniat.module';
import { DebitNoteModule } from './modules/purchasing/debit-note/debit-note.module';
import { CreditNotSalesModule } from './modules/sales/credit-not-sales/credit-not-sales.module';
import { DebitNoteSalesModule } from './modules/sales/debit-note-sales/debit-note-sales.module';
import { CashierConfigModule } from './modules/treasury/maintenance/cashier_config/cashier_config.module';
import { CashiersTreasuryModule } from './modules/treasury/cashiers_treasury/cashiers_treasury.module';
import { MovementsModule } from './modules/treasury/movements/movements.module';
import { TypeOfMovementModule } from './modules/treasury/maintenance/type_of_movement/type_of_movement.module';
import { ClinicHistoryModule } from './modules/medic/clinic-history/clinic-history.module';
import { AdjuntesModule } from './modules/medic/adjuntes/adjuntes.module';
import { PatientModule } from './modules/medic/patient/patient.module';
import { ExcelModule } from './modules/excel/excel.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { Adjuntesv2Module } from './modules/medic/adjuntesv2/adjuntesv2.module';


@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forRoot(dbdatasource),
        // MicroserviceClientsModule.register([
        //     {
        //         name: 'AUTH_SERVICE',
        //         transport: Transport.TCP,
        //         options: {
        //             host: process.env.AUTH_SERVICE_HOST || 'localhost',
        //             port: 3003  || Number(process.env.AUTH_SERVICE_SHARED_PORT)
        //         },
        //     },
        // ]),
        UsersModule,
        ActionsModule,
        StatusModule,
        AuthModule,
        PackagesModule,
        ApplicationsModule,
        PagesModule,
        ProfilesModule,
        CompaniesModule,
        // PrinterBrandsModule,
        // PrinterTypesModule,
        // PrinterModelsModule,
        // PrintersModule,
        // CashierTypesModule,
        // CashiersModule,
        // StatesModule,
        // CitiesModule,
        // BrandsModule,
        MailsModule,
        // BanksModule,
        // CategoriesModule,
        // SubCategoriesModule,
        // TypesPresentationModule,
        // UnitsConcentrationModule,
        // TypesPackagingModule,
        // UnitsMeasurementModule,
        // CatalogueModule,
        // MoneyModule,
        ExchangeRateModule,
        // ConcentrationModule,
        // QuantitiesPackageModule,
        ScrappingServiceModule,
        DocumentTypesModule,
        ClientTypesModule,
        TaxpayerTypesModule,
        // ClientsModule,
        // ProvidersModule,
        IdentificationTypesModule,
        SocketModule,
        // TaxesModule,
        // PaymentMethodModule,
        // AccountModule,
        // TaxUnitsRateModule,
        // Rates2RangesModule,
        // TypesPeopleIsrlModule,
        // PaymentConceptsModule,
        // RatesOrPorcentageModule,
        // PaymentsModule,
        TypeOfPeopleModule,
        // ReasonModule,
        // CreditNoteModule,
        // ModuleModule,
        // ReceivedPaymentsModule,
        // ComissionPerPaymentMethodModule,
        // InvoiceTypesModule,
        // DiscountTypesModule,
        // CorrelativeModule,
        // TaxRateSeniatModule,
        // DebitNoteModule,
        // CreditNotSalesModule,
        // DebitNoteSalesModule,
        // CashierConfigModule,
        // CashiersTreasuryModule,
        // MovementsModule,
        // TypeOfMovementModule,
        ClinicHistoryModule,
        AdjuntesModule,
        PatientModule,
        ExcelModule,
        PdfModule,
        Adjuntesv2Module,
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule {}
