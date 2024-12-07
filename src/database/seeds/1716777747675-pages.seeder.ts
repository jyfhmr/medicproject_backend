import { Injectable } from '@nestjs/common';
import { ApplicationsService } from 'src/modules/config/applications/applications.service';
import { Page } from 'src/modules/config/pages/entities/page.entity';
import { Profile } from 'src/modules/config/profiles/entities/profile.entity';
import { ProfilePages } from 'src/modules/config/profiles/entities/profilePages.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

@Injectable()
export class PagesSeeder1716777747675 implements Seeder {
    constructor(private applicationsService: ApplicationsService) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const pageRepository = dataSource.getRepository(Page);
        const profilePagesRepository = dataSource.getRepository(ProfilePages);
        const profileRepository = dataSource.getRepository(Profile);

        const pagesAudits = [
            {
                name: 'Tasa de cambio',
                route: '/dashboard/audits/exchange_rate',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Tasa de impuesto seniat',
                route: '/dashboard/audits/taxRateSeniat',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Concepto de pago ISRL',
                route: '/dashboard/audits/payment_concepts',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Tarifa o porcentaje',
                route: '/dashboard/audits/rates_or_porcentage',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Tipo de persona ISRL',
                route: '/dashboard/audits/types-people-isrl',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Valor de Unidad Tributaria',
                route: '/dashboard/audits/tax_units_rate',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Tarifas 2 - Personas Jurídicas no Domiciliadas',
                route: '/dashboard/audits/rates2_ranges',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Motivo',
                route: '/dashboard/audits/reason',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
        ];

        const pagesSales = [
            {
                name: 'Pos',
                route: '/dashboard/sales/pos',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Facturas',
                route: '/dashboard/sales/invoices',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Cuentas por cobrar',
                route: '/dashboard/sales/cxc',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Nota de credito',
                route: '/dashboard/sales/creditNote',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Nota de debito',
                route: '/dashboard/sales/debitNote',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Libro de ventas',
                route: '/dashboard/sales/salesBook',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
        ];

        const pagesMaestros = [
            {
                name: 'Estados',
                route: '/dashboard/masters/states',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Ciudades',
                route: '/dashboard/masters/cities',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Tipos de Identificación',
                route: '/dashboard/masters/identification_types',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Tipos de Documento',
                route: '/dashboard/masters/document_types',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Tipos de Cliente',
                route: '/dashboard/masters/client_types',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Tipos de Contribuyente',
                route: '/dashboard/masters/taxpayer_types',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Clientes',
                route: '/dashboard/masters/clients',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Proveedores',
                route: '/dashboard/masters/providers',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
        ];

        const pagesConfiguration = [
            {
                name: 'Usuarios',
                route: '/dashboard/config/users',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Acciones',
                route: '/dashboard/config/actions',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Modulos',
                route: '/dashboard/config/module',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Aplicaciones',
                route: '/dashboard/config/applications',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Paquetes',
                route: '/dashboard/config/packages',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Páginas',
                route: '/dashboard/config/pages',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Perfiles',
                route: '/dashboard/config/profiles',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Estatus',
                route: '/dashboard/config/status',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Tipos de Impresora',
                route: '/dashboard/config/printer_types',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Marcas de Impresora',
                route: '/dashboard/config/printer_brands',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Modelos de Impresora',
                route: '/dashboard/config/printer_models',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Impresoras',
                route: '/dashboard/config/printers',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Tipo de Cajas',
                route: '/dashboard/config/cashier_types',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Cajas',
                route: '/dashboard/config/cashiers',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Empresas',
                route: '/dashboard/config/companies',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
        ];
        const pagesTreasuryMaintenance = [
            {
                name: 'Bancos',
                route: '/dashboard/treasury/maintenance/banks',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Cuentas',
                route: '/dashboard/treasury/maintenance/account',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Monedas',
                route: '/dashboard/treasury/maintenance/money',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Método de pago',
                route: '/dashboard/treasury/maintenance/payment_method',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Impuestos',
                route: '/dashboard/treasury/maintenance/taxes',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Configuracion de caja',
                route: '/dashboard/treasury/maintenance/cashier_config',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
        ];

        const savedPagesTreasuryMaintenance = await pageRepository.save(pagesTreasuryMaintenance);

        const pagesTreasury = [
            {
                name: 'Pagos Emitidos',
                route: '/dashboard/treasury/payments',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Pagos Recibidos',
                route: '/dashboard/treasury/received_payments',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Cajas',
                route: '/dashboard/treasury/cashiers',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Mantenimiento',
                route: '/dashboard/treasury/maintenance',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                pages: savedPagesTreasuryMaintenance,
            },
        ];

        const savedPagesInventoryMaintenanceconfig = [
            {
                name: 'Marcas',
                route: '/dashboard/inventory/maintenance/brands',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 1,
            },

            {
                name: 'Categorias',
                route: '/dashboard/inventory/maintenance/categories',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 2,
            },
            {
                name: 'Sub categorias',
                route: '/dashboard/inventory/maintenance/sub-categories',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 3,
            },
            {
                name: 'Concentraciones',
                route: '/dashboard/inventory/maintenance/concentration',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 4,
            },

            {
                name: 'Tipos de paquetes',
                route: '/dashboard/inventory/maintenance/types-packaging',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 5,
            },
            {
                name: 'Tipos de presentacion',
                route: '/dashboard/inventory/maintenance/types-presentation',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 6,
            },
            {
                name: 'Unidades de concentracion',
                route: '/dashboard/inventory/maintenance/units-concentration',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 6,
            },
            {
                name: 'Unidades de medida',
                route: '/dashboard/inventory/maintenance/units-measurement',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 7,
            },
            {
                name: 'Cantidad por Paquete',
                route: '/dashboard/inventory/maintenance/quantities-package',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 8,
            },
        ];

        const savedPagesPurchasing = [
            {
                name: 'Cuentas por pagar',
                route: '/dashboard/purchasing/cxp',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 1,
            },
            {
                name: 'Facturas',
                route: '/dashboard/purchasing/invoicing',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 2,
            },
            {
                name: 'Notas de debito',
                route: '/dashboard/purchasing/debitNote',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 3,
            },
            {
                name: 'Notas de credito',
                route: '/dashboard/purchasing/creditNote',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 4,
            },
            {
                name: 'Libro de compras',
                route: '/dashboard/purchasing/purchasesBook',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 5,
            },
            {
                name: 'Retenciones ISRL',
                route: '/dashboard/purchasing/retentionISRL',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 6,
            },
            {
                name: 'Retenciones IVA',
                route: '/dashboard/purchasing/retentionIva',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 7,
            },
        ];

        const savedPagesInventoryMaintenanceconfigSave = await pageRepository.save(
            savedPagesInventoryMaintenanceconfig,
        );
        const savedPagesPurchasingSave = await pageRepository.save(savedPagesPurchasing);

        const pagesInventory = [
            {
                name: 'Catalogo',
                route: '/dashboard/inventory/catalogue',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                order: 1,
                userUpdate: { id: 1 },
            },
            {
                name: 'Ajuste',
                route: '/dashboard/inventory/adjustment',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                order: 2,
                userUpdate: { id: 1 },
            },
            {
                name: 'Libro de inventario',
                route: '/dashboard/inventory/inventoryBook',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                order: 3,
                userUpdate: { id: 1 },
            },
            {
                name: 'Salida',
                route: '/dashboard/inventory/output',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                order: 4,
                userUpdate: { id: 1 },
            },
            {
                name: 'Mantenimiento',
                route: '/dashboard/inventory/maintenance',
                packages: [{ id: 1 }],
                application: { id: 1 },
                user: { id: 1 },
                order: 5,
                userUpdate: { id: 1 },
                pages: savedPagesInventoryMaintenanceconfigSave,
            },
        ];


        const medicPages = [
            {
                name: 'Crear Ficha de Paciente',
                route: '/dashboard/medic/create-patient',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                order: 1,
                userUpdate: { id: 1 },
            },
            {
                name: 'Historia Médica',
                route: '/dashboard/medic/clinic-history',
                packages: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
                application: { id: 1 },
                user: { id: 1 },
                order: 1,
                userUpdate: { id: 1 },
            },
        ];

        const medicPagesSaved = await pageRepository.save(medicPages)

        const savedPagesConfiguration = await pageRepository.save(pagesConfiguration);
        const savedPagesMaestros = await pageRepository.save(pagesMaestros);
        const savedPagesTreasury = await pageRepository.save(pagesTreasury);
        const savedPagesInventory = await pageRepository.save(pagesInventory);
        const savedPagesAudits = await pageRepository.save(pagesAudits);
        const savedPagesSales = await pageRepository.save(pagesSales);

        const pagesFather = [
            {
                name: 'Pacientes',
                route: '/dashboard/medic',
                packages: [{ id: 1 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 1,
                icon: 'MedicineBoxOutlined',
                pages: medicPagesSaved ,
            },
            {
                name: 'Ventas',
                route: '/dashboard/sales',
                packages: [{ id: 1 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 1,
                icon: 'ShopOutlined',
                pages: savedPagesSales,
            },
            {
                name: 'Compra',
                route: '/dashboard/purchasing',
                packages: [{ id: 1 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 2,
                icon: 'ShoppingCartOutlined',
                pages: savedPagesPurchasingSave,
            },
            {
                name: 'Tesorería',
                route: '/dashboard/treasury',
                packages: [{ id: 1 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                icon: 'BankOutlined',
                order: 3,
                pages: savedPagesTreasury,
            },
            {
                name: 'Maestros',
                route: '/dashboard/masters',
                packages: [{ id: 1 }],
                application: { id: 1 },
                user: { id: 1 },
                icon: 'DatabaseOutlined',
                userUpdate: { id: 1 },
                order: 4,
                pages: savedPagesMaestros,
            },

            {
                name: 'Inventario',
                route: '/dashboard/inventory',
                packages: [{ id: 1 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 5,
                icon: 'ProductOutlined',
                pages: savedPagesInventory,
            },

            {
                name: 'Auditoria',
                route: '/dashboard/audits',
                packages: [{ id: 1 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 6,
                icon: 'AuditOutlined',
                pages: savedPagesAudits,
            },

            {
                name: 'Configuración',
                route: '/dashboard/config',
                packages: [{ id: 1 }],
                application: { id: 1 },
                user: { id: 1 },
                userUpdate: { id: 1 },
                order: 7,
                icon: 'SettingOutlined',
                pages: savedPagesConfiguration,
            },
        ];

        const pagesFatherConfig = await pageRepository.save(pagesFather);

        const profile = await profileRepository.findOne({ where: { id: 1 } });

        if (profile) {
            for (const page of pagesFatherConfig) {
                await profilePagesRepository.save({
                    profile,
                    page,
                    package: { id: 1 },
                });
                page.pages.forEach(async (el) => {
                    await profilePagesRepository.save({
                        profile,
                        page: el,
                        package: { id: 4 },
                    });

                    if (el.pages && el.pages.length > 0) {
                        el.pages.forEach(async (elChild) => {
                            await profilePagesRepository.save({
                                profile,
                                page: elChild,
                                package: { id: 4 },
                            });
                        });
                    }
                });
            }
        }
    }
}
