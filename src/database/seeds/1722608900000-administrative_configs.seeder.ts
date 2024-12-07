// import { TypesPeopleIsrl } from '../../modules/audits/types_people_isrl/entities/types_people_isrl.entity';
// import { DataSource } from 'typeorm';
// import { Seeder, SeederFactoryManager } from 'typeorm-extension';
// import { RatesOrPorcentage } from '../../modules/audits/rates_or_porcentage/entities/rates_or_porcentage.entity';
// import { config_admistrative_paymentConcept } from '../../modules/audits/payment_concepts/entities/payment_concept.entity';
// import { TaxUnitsRate } from '../../modules/audits/tax_units_rate/entities/tax_units_rate.entity';
// import { Rates2Range } from '../../modules/audits/rates2_ranges/entities/rates2_range.entity';

// export class AdministrativeConfigsSeeder1722608900000 implements Seeder {
//     track = false;

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
//         await this.seedTaxUnitsRate(dataSource);
//         await this.seedRatesOrPorcentage(dataSource);
//         await this.seedTypesPeopleIsrl(dataSource);
//         await this.seedRates2(dataSource);
//         await this.seedPaymentConcepts(dataSource);
//     }

//     private async seedTaxUnitsRate(dataSource: DataSource) {
//         const repositoryTaxUnitRate = dataSource.getRepository(TaxUnitsRate);
//         const taxUnitRateDefault = { value: 9.0, user: { id: 1 }, userUpdate: { id: 1 } };
//         await repositoryTaxUnitRate.save(taxUnitRateDefault);
//     }

//     private async seedRatesOrPorcentage(dataSource: DataSource) {
//         const repository = dataSource.getRepository(RatesOrPorcentage);

//         const ratesOrPorcentageData = [
//             { value: '5%', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
//             { value: '34%', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
//             { value: '16%', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
//             { value: '2%', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
//             { value: '1%', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
//             { value: '3%', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
//             { value: 'TARIFA N° 2', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
//             { value: '4,95%', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
//             { value: 'No aplica', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
//             { value: '10%', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
//             { value: '0%', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
//         ];

//         await repository.save(ratesOrPorcentageData);
//     }

//     public async seedTypesPeopleIsrl(dataSource: DataSource) {
//         const repositoryTypesPeopleIsrl = dataSource.getRepository(TypesPeopleIsrl);

//         const typesPeopleIsrl = [
//             {
//                 type: 'Persona Natural No Residente',
//                 code: 'PNNR',
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 isActive: true,
//             },
//             {
//                 type: 'Persona Natural Residente',
//                 code: 'PNR',
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 isActive: true,
//             },
//             {
//                 type: 'Persona Juridica No Domiciliada',
//                 code: 'PJND',
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 isActive: true,
//             },
//             {
//                 type: 'Persona Juridica Domiciliada',
//                 code: 'PJD',
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 isActive: true,
//             },
//         ];

//         await repositoryTypesPeopleIsrl.save(typesPeopleIsrl);
//     }

//     private async seedRates2(dataSource: DataSource) {
//         const repository = dataSource.getRepository(Rates2Range);

//         const rates2 = [
//             {
//                 rateOrPorcentage: { id: 7 },
//                 minimumAmountPaid: 1,
//                 maximumAmountPaid: 2000,
//                 retentionPorcentage: 15,
//                 sustractingUT: 0,
//                 sustractingBs: 0.0,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//             },
//             {
//                 rateOrPorcentage: { id: 7 },
//                 minimumAmountPaid: 2001,
//                 maximumAmountPaid: 3000,
//                 retentionPorcentage: 22,
//                 sustractingUT: 140,
//                 sustractingBs: 1260.0,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//             },
//             {
//                 rateOrPorcentage: { id: 7 },
//                 minimumAmountPaid: 3001,
//                 maximumAmountPaid: 99999999999999,
//                 retentionPorcentage: 34,
//                 sustractingUT: 500,
//                 sustractingBs: 4500.0,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//             },
//         ];

//         await repository.save(rates2);
//     }

//     private async seedPaymentConcepts(dataSource: DataSource) {
//         const repository = dataSource.getRepository(config_admistrative_paymentConcept);

//         const paymentConceptsData = [
//             {
//                 name: 'HONORARIOS PROFESIONALES',
//                 numeroLiteral: '9.1. a',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '003',
//                         taxBase: 90,
//                         typesPeopleIsrl: { id: 1 }, // Persona Natural No Residente
//                         ratesOrPorcentage: { id: 2 }, // 34%
//                     },
//                     {
//                         codeSeniat: '005',
//                         taxBase: 90,
//                         typesPeopleIsrl: { id: 3 }, // Persona Jurídica No Domiciliada
//                         ratesOrPorcentage: { id: 7 }, // TARIFA N° 2
//                     },
//                 ],
//             },
//             {
//                 name: 'HONORARIOS PROFESIONALES',
//                 numeroLiteral: '9.1. b',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '002',
//                         taxBase: 100,
//                         pageRangeBS: 750.0,
//                         sustractingBS: 22.5,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 6 },
//                     },
//                     {
//                         codeSeniat: '004',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                 ],
//             },
//             {
//                 name: 'HONORARIOS PROF. EN HIPÓDROMOS',
//                 numeroLiteral: '9.1. c',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '011',
//                         taxBase: 90,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 4 },
//                     },
//                     {
//                         codeSeniat: '010',
//                         taxBase: 100,
//                         pageRangeBS: 750.0,
//                         sustractingBS: 22.5,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 6 },
//                     },
//                 ],
//             },
//             {
//                 name: 'HONORARIOS PROF. EN CENTROS DE SALUD',
//                 numeroLiteral: '9.1. d',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '013',
//                         taxBase: 90,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 2 },
//                     },
//                     {
//                         codeSeniat: '012',
//                         taxBase: 100,
//                         pageRangeBS: 750.0,
//                         sustractingBS: 22.5,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 6 },
//                     },
//                 ],
//             },
//             {
//                 name: 'COMISIONES ENAJENACION INMUEBLES',
//                 numeroLiteral: '9.2. a',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '015',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 2 },
//                     },
//                     {
//                         codeSeniat: '014',
//                         taxBase: 100,
//                         pageRangeBS: 750.0,
//                         sustractingBS: 22.5,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 6 },
//                     },
//                     {
//                         codeSeniat: '017',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                     {
//                         codeSeniat: '016',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                 ],
//             },
//             {
//                 name: 'COMISIONES MERCANTILES Y OTRAS',
//                 numeroLiteral: '9.2. b',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '019',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 2 },
//                     },
//                     {
//                         codeSeniat: '018',
//                         taxBase: 100,
//                         pageRangeBS: 750.0,
//                         sustractingBS: 22.5,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 6 },
//                     },
//                     {
//                         codeSeniat: '021',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                     {
//                         codeSeniat: '020',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                 ],
//             },
//             {
//                 name: 'INTERESES ART. 27 # 2 L.I.S.L.R.',
//                 numeroLiteral: '9.3. a',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '022',
//                         taxBase: 95,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 2 },
//                     },
//                     {
//                         codeSeniat: '023',
//                         taxBase: 95,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 7 },
//                     },
//                 ],
//             },
//             {
//                 name: 'INTERESES ART. 52 PARÁGRAFO 2º L.I.S.L.R',
//                 numeroLiteral: '9.3. b',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '024',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 8 },
//                     },
//                 ],
//             },
//             {
//                 name: 'INTERESES',
//                 numeroLiteral: '9.3. c',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '026',
//                         taxBase: 95,
//                         typesPeopleIsrl: { id: 1 }, // Persona Natural No Residente
//                         ratesOrPorcentage: { id: 2 }, // 34%
//                     },
//                     {
//                         codeSeniat: '025',
//                         taxBase: 100,
//                         pageRangeBS: 750.0,
//                         sustractingBS: 22.5,
//                         typesPeopleIsrl: { id: 2 }, // Persona Jurídica No Domiciliada
//                         ratesOrPorcentage: { id: 6 },
//                     },
//                     {
//                         codeSeniat: '028',
//                         taxBase: 95,
//                         typesPeopleIsrl: { id: 3 }, // Persona Jurídica No Domiciliada
//                         ratesOrPorcentage: { id: 7 },
//                     },
//                     {
//                         codeSeniat: '027',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 4 }, // Persona Jurídica No Domiciliada
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                 ],
//             },
//             {
//                 name: 'AGENCIAS DE NOTICIAS INTERNACIONALES ART. 35 LISR',
//                 numeroLiteral: '9.4',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '029',
//                         taxBase: 15,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 7 },
//                     },
//                 ],
//             },
//             {
//                 name: 'FLETES Y GTOS DE TRANSP. INTERNA. (entre Venezuela y el Exterior o viceversa). ART. 36 LISR',
//                 numeroLiteral: '9.5',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '031',
//                         taxBase: 5,
//                         typesPeopleIsrl: { id: 3 }, // Persona Jurídica No Domiciliada
//                         ratesOrPorcentage: { id: 7 }, // TARIFA N° 2
//                     },
//                 ],
//             },
//             {
//                 name: 'FLETES EN EL PAIS A EMP. INTERNAC. ART. 36 LISLR',
//                 numeroLiteral: '9.5',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '031',
//                         taxBase: 10,
//                         typesPeopleIsrl: { id: 3 }, // Persona Jurídica No Domiciliada
//                         ratesOrPorcentage: { id: 7 }, // TARIFA N° 2
//                     },
//                 ],
//             },
//             {
//                 name: 'EXHIBICIÓN DE PELICULAS. ART 27 # 15, y 34 LISR',
//                 numeroLiteral: '9.6',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '032',
//                         taxBase: 25,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 2 },
//                     },
//                     {
//                         codeSeniat: '033',
//                         taxBase: 25,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 7 },
//                     },
//                 ],
//             },
//             {
//                 name: 'REGALIAS ART 27 # 16 LISR',
//                 numeroLiteral: '9.7',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '034',
//                         taxBase: 90,

//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 2 },
//                     },
//                     {
//                         codeSeniat: '035',
//                         taxBase: 90,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 7 },
//                     },
//                 ],
//             },
//             {
//                 name: 'ASISTENCIA TÉCNICA ART 27 # 16 LISR',
//                 numeroLiteral: '9.7',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '036',
//                         taxBase: 30,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 2 },
//                     },
//                     {
//                         codeSeniat: '037',
//                         taxBase: 30,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 7 },
//                     },
//                 ],
//             },
//             {
//                 name: 'SERVICIOS TECNOLOGICOS ART 27 # 16 LISR',
//                 numeroLiteral: '9.7',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '038',
//                         taxBase: 50,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 2 },
//                     },
//                     {
//                         codeSeniat: '039',
//                         taxBase: 50,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 7 },
//                     },
//                 ],
//             },
//             {
//                 name: 'PRIMAS DE SEGURO Y REASEG. ART. 27 #18 Y PARAGRAFO 3º ART. 52 LISR',
//                 numeroLiteral: '9.8',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '040',
//                         taxBase: 30,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 10 },
//                     },
//                 ],
//             },
//             {
//                 name: 'GANANCIAS EN JUEGOS Y APUESTAS',
//                 numeroLiteral: '9.9',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '042',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 2 },
//                     },
//                     {
//                         codeSeniat: '041',
//                         taxBase: 100,
//                         pageRangeBS: 0,
//                         sustractingBS: 0,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 2 },
//                     },
//                     {
//                         codeSeniat: '044',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 2 },
//                     },
//                     {
//                         codeSeniat: '043',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 2 },
//                     },
//                 ],
//             },
//             {
//                 name: 'PREMIOS LOTERÍA E HIPÓDROMOS ART. 62 LISLR',
//                 numeroLiteral: '9.9',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '046',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 3 },
//                     },
//                     {
//                         codeSeniat: '045',
//                         taxBase: 100,
//                         pageRangeBS: 0,
//                         sustractingBS: 0,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 3 },
//                     },
//                     {
//                         codeSeniat: '048',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 3 },
//                     },
//                     {
//                         codeSeniat: '047',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 3 },
//                     },
//                 ],
//             },
//             {
//                 name: 'PROPIETARIOS DE ANIMALES DE CARRERAS POR PREMIOS RECIBIDOS',
//                 numeroLiteral: '9.11',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '050',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 2 },
//                     },
//                     {
//                         codeSeniat: '049',
//                         taxBase: 100,
//                         pageRangeBS: 750.0,
//                         sustractingBS: 22.5,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 3 },
//                     },
//                     {
//                         codeSeniat: '052',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                     {
//                         codeSeniat: '051',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                 ],
//             },
//             {
//                 name: 'SERVICIOS',
//                 numeroLiteral: '9.11',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '054',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 2 },
//                     },
//                     {
//                         codeSeniat: '053',
//                         taxBase: 100,
//                         pageRangeBS: 750.0,
//                         sustractingBS: 22.5,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 5 },
//                     },
//                     {
//                         codeSeniat: '056',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 7 },
//                     },
//                     {
//                         codeSeniat: '054',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 4 },
//                     },
//                 ],
//             },
//             {
//                 name: 'ARRENDAMIENTO BIENES INMUEBLES',
//                 numeroLiteral: '9.12',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '058',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 2 },
//                     },
//                     {
//                         codeSeniat: '057',
//                         taxBase: 100,
//                         pageRangeBS: 750.0,
//                         sustractingBS: 22.5,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 6 },
//                     },
//                     {
//                         codeSeniat: '060',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 7 },
//                     },
//                     {
//                         codeSeniat: '059',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                 ],
//             },
//             {
//                 name: 'ARRENDAMIENTO BIENES MUEBLES',
//                 numeroLiteral: '9.13',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '062',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 2 },
//                     },
//                     {
//                         codeSeniat: '061',
//                         taxBase: 100,
//                         pageRangeBS: 750.0,
//                         sustractingBS: 22.5,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 6 },
//                     },
//                     {
//                         codeSeniat: '064',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                     {
//                         codeSeniat: '063',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                 ],
//             },

//             {
//                 name: 'PAGOS DE TARJETAS DE CRÉDITO O CONSUMO',
//                 numeroLiteral: '9.14',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '066',
//                         taxBase: 0,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 2 }, // 34%
//                     },
//                     {
//                         codeSeniat: '065',
//                         taxBase: 0,
//                         pageRangeBS: 0,
//                         sustractingBS: 0,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 6 },
//                     },
//                     {
//                         codeSeniat: '068',
//                         taxBase: 0,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 1 }, // 34%
//                     },
//                     {
//                         codeSeniat: '067',
//                         taxBase: 0,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 1 }, // 34%
//                     },
//                 ],
//             },
//             {
//                 name: 'PAGO DE GASOLINA CON TARJETA DE CRÉDITO O CONSUMO',
//                 numeroLiteral: '9.14',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '069',
//                         taxBase: 0,
//                         pageRangeBS: 0,
//                         sustractingBS: 0,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 5 },
//                     },
//                     {
//                         codeSeniat: '070',
//                         taxBase: 0,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 5 }, // TARIFA N° 2
//                     },
//                 ],
//             },
//             {
//                 name: 'FLETES Y GASTOS DE TRANSPORTE NACIONAL',
//                 numeroLiteral: '9.14',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '071',
//                         taxBase: 100,
//                         pageRangeBS: 750.0,
//                         sustractingBS: 22.5,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 5 },
//                     },
//                     {
//                         codeSeniat: '072',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 6 },
//                     },
//                 ],
//             },
//             {
//                 name: 'PAGO DE EMP. DE SEGURO A CORREDORES',
//                 numeroLiteral: '9.16',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '073',
//                         taxBase: 100,
//                         pageRangeBS: 750.0,
//                         sustractingBS: 22.5,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 6 }, // 5%
//                     },
//                     {
//                         codeSeniat: '074',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                 ],
//             },
//             {
//                 name: 'PRIMAS DE EMPRESAS DE SEGUROS POR REPARACION DE BIENES DE SUS ASEGURADOS',
//                 numeroLiteral: '9.17',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '075',
//                         taxBase: 100,
//                         pageRangeBS: 750.0,
//                         sustractingBS: 22.5,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 6 },
//                     },
//                     {
//                         codeSeniat: '076',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                 ],
//             },
//             {
//                 name: 'PAGO DE EMPRESAS DE SEGURO A CENTROS DE SALUD POR ATENCION DE SUS ASEGURADOS',
//                 numeroLiteral: '9.17',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '077',
//                         taxBase: 100,
//                         pageRangeBS: 750.0,
//                         sustractingBS: 22.5,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 6 },
//                     },
//                     {
//                         codeSeniat: '077',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                 ],
//             },

//             {
//                 name: 'PAGOS POR ADQUISICIÓN DE FONDOS DE COMERCIO',
//                 numeroLiteral: '9.18',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '080',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 2 },
//                     },
//                     {
//                         codeSeniat: '079',
//                         taxBase: 100,
//                         pageRangeBS: 750.0,
//                         sustractingBS: 22.5,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 6 },
//                     },
//                     {
//                         codeSeniat: '082',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                     {
//                         codeSeniat: '081',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                 ],
//             },
//             {
//                 name: 'PUBLICIDAD Y PROPAGANDA',
//                 numeroLiteral: '9.19',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '083',
//                         taxBase: 100,
//                         pageRangeBS: 750.0,
//                         sustractingBS: 22.5,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 6 },
//                     },
//                     {
//                         codeSeniat: '085',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                     {
//                         codeSeniat: '084',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                 ],
//             },
//             {
//                 name: 'PUBLICIDAD Y PROPAGANDA EMISORAS DE RADIO',
//                 numeroLiteral: '9.19',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '086',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 1 },
//                     },
//                 ],
//             },
//             {
//                 name: 'PROCEDIMIENTOS POR ENAJENACION DE ACCIONES EN LA BOLSA DE VALORES',
//                 numeroLiteral: '9.20',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 5 }, // 1%
//                     },
//                     {
//                         codeSeniat: '',
//                         taxBase: 100,
//                         pageRangeBS: 0,
//                         sustractingBS: 0,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 5 }, //
//                     },
//                     {
//                         codeSeniat: '',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 5 }, // 1%
//                     },
//                     {
//                         codeSeniat: '',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 5 }, // 1%
//                     },
//                 ],
//             },
//             {
//                 name: 'PAGOS POR ENAJENACIÓN DE ACCIONES FUERA DE LA BOLSA DE VALORES',
//                 numeroLiteral: '9.21',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 2 }, // 1%
//                     },
//                     {
//                         codeSeniat: '',
//                         taxBase: 100,
//                         pageRangeBS: 750.0,
//                         sustractingBS: 22.5,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 6 }, //
//                     },
//                     {
//                         codeSeniat: '',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 1 }, // 1%
//                     },
//                     {
//                         codeSeniat: '',
//                         taxBase: 100,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 1 }, // 1%
//                     },
//                 ],
//             },
//             {
//                 name: 'PROVEEDOR',
//                 numeroLiteral: '9.21',
//                 isActive: true,
//                 user: { id: 1 },
//                 userUpdate: { id: 1 },
//                 IsrlWitholdings: [
//                     {
//                         codeSeniat: '',
//                         taxBase: 0,
//                         typesPeopleIsrl: { id: 1 },
//                         ratesOrPorcentage: { id: 11 }, // 1%
//                     },
//                     {
//                         codeSeniat: '',
//                         taxBase: 0,
//                         pageRangeBS: 0,
//                         sustractingBS: 0,
//                         typesPeopleIsrl: { id: 2 },
//                         ratesOrPorcentage: { id: 11 }, //
//                     },
//                     {
//                         codeSeniat: '',
//                         taxBase: 0,
//                         typesPeopleIsrl: { id: 3 },
//                         ratesOrPorcentage: { id: 11 }, // 1%
//                     },
//                     {
//                         codeSeniat: '',
//                         taxBase: 0,
//                         typesPeopleIsrl: { id: 4 },
//                         ratesOrPorcentage: { id: 11 }, // 1%
//                     },
//                 ],
//             },
//         ];

//         await repository.save(paymentConceptsData);
//     }
// }
