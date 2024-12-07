import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Brand } from 'src/modules/inventory/maintenance/brands/entities/brand.entity';
import { Category } from 'src/modules/inventory/maintenance/categories/entities/category.entity';
import { Concentration } from 'src/modules/inventory/maintenance/concentration/entities/concentration.entity';
import { QuantitiesPackage } from 'src/modules/inventory/maintenance/quantities-package/entities/quantities-package.entity';
import { SubCategory } from 'src/modules/inventory/maintenance/sub-categories/entities/sub-category.entity';
import { TypesPackaging } from 'src/modules/inventory/maintenance/types-packaging/entities/types-packaging.entity';
import { TypesPresentation } from 'src/modules/inventory/maintenance/types-presentation/entities/types-presentation.entity';
import { UnitsConcentration } from 'src/modules/inventory/maintenance/units-concentration/entities/units-concentration.entity';
import { UnitsMeasurement } from 'src/modules/inventory/maintenance/units-measurement/entities/units-measurement.entity';

export class InventarySeeder1723557129712 implements Seeder {
    track = false;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        // await this.seedBrand(dataSource);
        // await this.seedCategories(dataSource);
        // await this.seedSubCategories(dataSource);
        // await this.seedConcentration(dataSource);
        // await this.seedQuantitiesPackage(dataSource);
        // await this.seedTypesPackaging(dataSource);
        // await this.seedTypesPresentation(dataSource);
        // await this.seedUnitsConcentration(dataSource);
        // await this.seedUnitsMeasurement(dataSource);
    }

    private async seedBrand(dataSource: DataSource) {
        const repositoryBrand = dataSource.getRepository(Brand);
        const brands = [
            {
                name: 'AstraZeneca',
                code: '00',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Axon Pharma',
                code: '01',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            { name: 'Baxter', code: '02', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            {
                name: 'Bayer Venezuela',
                code: '03',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Beiersdorf',
                code: '04',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Boehringer Ingelheim',
                code: '05',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Bristol Myers Squibb',
                code: '06',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Eli Lilly',
                code: '07',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Eurofarma',
                code: '08',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Farmahorro',
                code: '09',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Farmatodo',
                code: '10',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'GlaxoSmithKline',
                code: '11',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Grünenthal',
                code: '12',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Johnson & Johnson',
                code: '13',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Laboratorios Farma',
                code: '14',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Laboratorios Leti',
                code: '15',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Laboratorios Vargas',
                code: '16',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            { name: 'Merck', code: '17', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            {
                name: 'Meyer Productos Terapéuticos',
                code: '18',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            { name: 'MSD', code: '19', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            {
                name: 'Novartis Venezuela',
                code: '20',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            { name: 'Pfizer', code: '21', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            {
                name: 'Reckitt Benckiser',
                code: '22',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            { name: 'Roche', code: '23', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: 'Sanofi', code: '24', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            {
                name: 'Schering-Plough',
                code: '25',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Stiefel de Venezuela, S.A.',
                code: '26',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
        ];
        await repositoryBrand.save(brands);
    }

    private async seedCategories(dataSource: DataSource) {
        const repositoryCategory = dataSource.getRepository(Category);

        const categories = [
            {
                name: 'Medicinas',
                code: '01',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Equipo y material médico',
                code: '02',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Vitaminas y Productos Naturales',
                code: '03',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Línea Baron',
                code: '04',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },

            {
                name: 'Material Médico Quirurgicos ',
                code: '05',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Suturas',
                code: '06',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Cuidados de Bebe',
                code: '07',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Cuidados de Adultos',
                code: '08',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Cuidado Pre y postnantal',
                code: '09',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Fórmulas Magistrales',
                code: '10',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Covid Medicamentos',
                code: '11',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Línea Homeopática',
                code: '12',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Dermocosméticas',
                code: '13',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Vacunas',
                code: '14',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Bienestar sexual',
                code: '15',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Anticonceptivos',
                code: '16',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Salud y cuidad personal',
                code: '17',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Cuidado dental',
                code: '18',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Cuidado oftálmico',
                code: '19',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Línea veterinaria',
                code: '20',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Alimentos',
                code: '21',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'Misceláneos',
                code: '22',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
        ];

        await repositoryCategory.save(categories);
    }

    private async seedSubCategories(dataSource: DataSource) {
        const repositorySubCategory = dataSource.getRepository(SubCategory);

        const subCategories = [
            {
                name: 'Antibióticos',
                code: '01',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Medicinas
            },
            {
                name: 'Antiinflamatorios',
                code: '02',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Medicinas
            },
            {
                name: 'Psicotrópicos',
                code: '03',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Medicinas
            },
            {
                name: 'Productos Controlados',
                code: '04',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Esteroides',
                code: '05',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Pediátricos',
                code: '06',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'AINE',
                code: '07',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Antitusígeno',
                code: '08',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Analgésico',
                code: '09',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Antipirético',
                code: '10',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Antiespasmódico',
                code: '11',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Probióticos',
                code: '12',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Gástricos',
                code: '13',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Hormonas',
                code: '14',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Refrigerados',
                code: '15',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Dermatológicas',
                code: '16',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Expectorantes',
                code: '17',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Mucolíticos',
                code: '18',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Sueros',
                code: '19',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Uso externo',
                code: '20',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 1 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Material médico',
                code: '21',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 2 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Instrumentos',
                code: '22',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 2 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Equipos',
                code: '23',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 2 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Suturas',
                code: '24',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 2 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Suplementos',
                code: '25',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 3 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Vitaminas',
                code: '26',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 3 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Productos naturales',
                code: '27',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 3 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Linea Baron',
                code: '28',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 4 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Insumos médicos',
                code: '29',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 5 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Antisépticos',
                code: '30',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 5 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Consumibles',
                code: '31',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 5 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Suturas',
                code: '32',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 6 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Consumibles',
                code: '33',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 7 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Usables',
                code: '34',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 7 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Equipos',
                code: '35',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 7 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Consumibles',
                code: '36',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 8 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Usables',
                code: '37',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 8 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Equipos',
                code: '38',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 8 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Consumibles',
                code: '39',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 9 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Usables',
                code: '40',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 9 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Equipos',
                code: '41',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 9 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Vacunas pediátricas',
                code: '42',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 14 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Antigripales',
                code: '43',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 14 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Inmunológicas ',
                code: '44',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 14 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Femenino',
                code: '45',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 15 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Masculino',
                code: '46',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 15 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Equipos',
                code: '47',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 15 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Instrumentos ',
                code: '48',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 15 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Mecánicos',
                code: '49',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 16 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Implantes',
                code: '50',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 16 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Orales',
                code: '51',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 16 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Femenino ',
                code: '52',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 17 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Masculino',
                code: '53',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 17 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Equipos',
                code: '54',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 17 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Instrumentos',
                code: '55',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 17 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Consumibles',
                code: '56',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 20 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Usables',
                code: '57',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 20 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Alimentos',
                code: '58',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 20 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Medicamentos',
                code: '59',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 20 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Bebidas',
                code: '60',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 21 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Snacks',
                code: '61',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 21 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Víveres',
                code: '62',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 21 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Refrigerados',
                code: '63',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 21 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Oficina',
                code: '64',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 22 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Hogar',
                code: '65',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 22 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'No aplica',
                code: '66',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 10 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'No aplica',
                code: '67',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 11 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'No aplica',
                code: '68',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 12 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'No aplica',
                code: '69',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 13 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'No aplica',
                code: '70',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 18 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'No aplica',
                code: '71',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 19 },
                subCategoryFhater: null, // Misceláneos
            },
            {
                name: 'Femenino',
                code: '72',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 3 },
                subCategoryFather: { id: 25 },
            },
            {
                name: 'Masculino',
                code: '73',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 3 },
                subCategoryFather: { id: 25 },
            },
            {
                name: 'Pediátrico',
                code: '74',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 3 }, // Misceláneos
                subCategoryFather: { id: 25 },
            },
            {
                name: 'Femenino +50',
                code: '75',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 3 }, // Misceláneos
                subCategoryFather: { id: 25 },
            },
            {
                name: 'Masculino +50',
                code: '76',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 3 }, // Misceláneos
                subCategoryFather: { id: 25 },
            },
            {
                name: 'Femenino',
                code: '77',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 3 },
                subCategoryFather: { id: 26 },
            },
            {
                name: 'Masculino',
                code: '78',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 3 },
                subCategoryFather: { id: 26 },
            },
            {
                name: 'Pediátrico',
                code: '79',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 3 }, // Misceláneos
                subCategoryFather: { id: 26 },
            },
            {
                name: 'Femenino +50',
                code: '80',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 3 }, // Misceláneos
                subCategoryFather: { id: 26 },
            },
            {
                name: 'Masculino +50',
                code: '81',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 3 }, // Misceláneos
                subCategoryFather: { id: 26 },
            },
            {
                name: 'Femenino',
                code: '82',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 3 },
                subCategoryFather: { id: 27 },
            },
            {
                name: 'Masculino',
                code: '83',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 3 },
                subCategoryFather: { id: 27 },
            },
            {
                name: 'Pediátrico',
                code: '84',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 3 }, // Misceláneos
                subCategoryFather: { id: 27 },
            },
            {
                name: 'Femenino +50',
                code: '85',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 3 }, // Misceláneos
                subCategoryFather: { id: 27 },
            },
            {
                name: 'Masculino +50',
                code: '86',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 3 }, // Misceláneos
                subCategoryFather: { id: 27 },
            },
            {
                name: 'Maquillaje ',
                code: '87',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 17 },
                subCategoryFather: { id: 52 }, // Misceláneos
            },
            {
                name: 'Cuidado del Cabello ',
                code: '88',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 17 },
                subCategoryFather: { id: 52 }, // Misceláneos
            },
            {
                name: 'Depilación ',
                code: '89',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 17 },
                subCategoryFather: { id: 52 }, // Misceláneos
            },
            {
                name: 'Cuidado del Cabello ',
                code: '90',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 17 },
                subCategoryFather: { id: 53 }, // Misceláneos
            },
            {
                name: 'Cuidado de la Barba ',
                code: '91',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
                category: { id: 17 },
                subCategoryFather: { id: 53 }, // Misceláneos
            },
        ];

        await repositorySubCategory.save(subCategories);
    }

    private async seedTypesPresentation(dataSource: DataSource) {
        const repositoryTypesPresentation = dataSource.getRepository(TypesPresentation);
        const typesPresentation = [
            {
                name: 'cápsulas',
                code: '01',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'cápsulas blandas',
                code: '02',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'comprimidos',
                code: '03',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            { name: 'crema', code: '04', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: 'gel', code: '05', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: 'gotas', code: '06', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            {
                name: 'gotas nasales',
                code: '07',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'gotas oftálmicas',
                code: '08',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'inyectable IM',
                code: '09',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'inyectable IV',
                code: '10',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            { name: 'jarabe', code: '11', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            {
                name: 'líquido',
                code: '12',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'parches',
                code: '13',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'pastillas',
                code: '14',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            { name: 'polvo', code: '15', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: 'pomada', code: '16', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: 'sobres', code: '17', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            {
                name: 'solución oftálmica',
                code: '18',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'soluciones',
                code: '19',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'tabletas',
                code: '20',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
            {
                name: 'tabletas masticables',
                code: '21',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
        ];
        await repositoryTypesPresentation.save(typesPresentation);
    }

    private async seedConcentration(dataSource: DataSource) {
        const repositoryConcentration = dataSource.getRepository(Concentration);
        const concentrations = [
            { name: '0.25', code: '001', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '0.5', code: '002', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '1', code: '003', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '1.25', code: '004', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '1.5', code: '005', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '2', code: '006', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '2.5', code: '007', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '3', code: '008', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '3.5', code: '009', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '4', code: '010', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '4.5', code: '011', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '5', code: '012', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '5.5', code: '013', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '6', code: '014', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '6.5', code: '015', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '7', code: '016', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '7.5', code: '017', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '8', code: '018', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '8.5', code: '019', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '9', code: '020', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '9.5', code: '021', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '10', code: '022', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '12', code: '023', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '14', code: '024', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '15', code: '025', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '18', code: '026', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '20', code: '027', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '21', code: '028', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '24', code: '029', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '28', code: '030', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '27.5', code: '031', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '30', code: '032', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '32', code: '033', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '35', code: '034', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '40', code: '035', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '45', code: '036', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '50', code: '037', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '55', code: '038', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '60', code: '039', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '65', code: '040', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '70', code: '041', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '75', code: '042', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '80', code: '043', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '85', code: '044', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '90', code: '045', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '95', code: '046', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '100', code: '047', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '110', code: '048', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '115', code: '049', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '120', code: '050', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '125', code: '051', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '130', code: '052', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '135', code: '053', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '140', code: '054', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '145', code: '055', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '150', code: '056', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '160', code: '057', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '170', code: '058', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '175', code: '059', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '180', code: '060', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '200', code: '061', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '220', code: '062', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '225', code: '063', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '250', code: '064', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '275', code: '065', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '300', code: '066', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '325', code: '067', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '350', code: '068', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '375', code: '069', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '400', code: '070', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '425', code: '071', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '450', code: '072', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '475', code: '073', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '500', code: '074', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '525', code: '075', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '550', code: '076', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '575', code: '077', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '600', code: '078', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '625', code: '079', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '650', code: '080', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '675', code: '081', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '700', code: '082', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '750', code: '083', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '800', code: '084', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '850', code: '085', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '900', code: '086', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '950', code: '087', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '1000', code: '088', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '1250', code: '089', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '1500', code: '090', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '1750', code: '091', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '2000', code: '092', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '2500', code: '093', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '3000', code: '094', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '4000', code: '095', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '5000', code: '096', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
        ];
        await repositoryConcentration.save(concentrations);
    }

    private async seedQuantitiesPackage(dataSource: DataSource) {
        const repositoryQuantitiesPackage = dataSource.getRepository(QuantitiesPackage);

        const quantitiesPackageData = [
            { name: '1', code: '001', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '2', code: '002', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '3', code: '003', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '4', code: '004', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '5', code: '005', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '6', code: '006', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '7', code: '007', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '8', code: '008', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '9', code: '009', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '10', code: '010', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '12', code: '011', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '14', code: '012', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '15', code: '013', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '16', code: '014', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '18', code: '015', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '20', code: '016', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '21', code: '017', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '22', code: '018', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '24', code: '019', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '25', code: '020', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '28', code: '021', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '30', code: '022', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '32', code: '023', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '35', code: '024', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '40', code: '025', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '42', code: '026', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '45', code: '027', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '50', code: '028', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '55', code: '029', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '60', code: '030', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '65', code: '031', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '70', code: '032', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '75', code: '033', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '80', code: '034', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '85', code: '035', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '90', code: '036', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '95', code: '037', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '100', code: '038', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '120', code: '039', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '130', code: '040', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '150', code: '041', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '160', code: '042', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '170', code: '043', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '175', code: '044', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '180', code: '045', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '185', code: '046', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '190', code: '047', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '200', code: '048', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '220', code: '049', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '222', code: '050', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '225', code: '051', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '250', code: '052', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '275', code: '053', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '300', code: '054', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '325', code: '055', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '333', code: '056', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '350', code: '057', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '360', code: '058', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '365', code: '059', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '375', code: '060', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '380', code: '061', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '400', code: '062', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '450', code: '063', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '454', code: '064', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '475', code: '065', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '480', code: '066', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '500', code: '067', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '550', code: '068', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '600', code: '069', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '650', code: '070', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '666', code: '071', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '700', code: '072', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '750', code: '073', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '800', code: '074', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '850', code: '075', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '900', code: '076', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '950', code: '077', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '1000', code: '078', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '1250', code: '079', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '1300', code: '080', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '1400', code: '081', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '1500', code: '082', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '1600', code: '083', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '1750', code: '084', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '2000', code: '085', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '2250', code: '086', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '2500', code: '087', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '2750', code: '088', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '3000', code: '089', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '3500', code: '090', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '4000', code: '091', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '4500', code: '092', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: '5000', code: '093', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
        ];

        await repositoryQuantitiesPackage.save(quantitiesPackageData);
    }

    private async seedTypesPackaging(dataSource: DataSource) {
        const repositoryTypesPackaging = dataSource.getRepository(TypesPackaging);
        const typesPackaging = [
            { name: 'Blister', code: '01', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: 'Bolsa', code: '02', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: 'Botella', code: '03', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: 'Caja', code: '04', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: 'Paquete', code: '05', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
        ];
        await repositoryTypesPackaging.save(typesPackaging);
    }

    private async seedUnitsConcentration(dataSource: DataSource) {
        const repositoryUnitsConcentration = dataSource.getRepository(UnitsConcentration);

        const unitsConcentration = [
            { name: 'ug', code: '01', user: { id: 1 }, userUpdate: { id: 1 }, isActive: true },
            { name: 'mg', code: '02', user: { id: 1 }, userUpdate: { id: 1 }, isActive: true },
            { name: 'g', code: '03', user: { id: 1 }, userUpdate: { id: 1 }, isActive: true },
            { name: 'kg', code: '04', user: { id: 1 }, userUpdate: { id: 1 }, isActive: true },
            { name: 'ml', code: '05', user: { id: 1 }, userUpdate: { id: 1 }, isActive: true },
            { name: 'dl', code: '06', user: { id: 1 }, userUpdate: { id: 1 }, isActive: true },
            { name: 'l', code: '07', user: { id: 1 }, userUpdate: { id: 1 }, isActive: true },
            {
                name: 'mg/ml',
                code: '08',
                user: { id: 1 },
                userUpdate: { id: 1 },
                isActive: true,
            },
            {
                name: 'ug/ml',
                code: '09',
                user: { id: 1 },
                userUpdate: { id: 1 },
                isActive: true,
            },
        ];
        await repositoryUnitsConcentration.save(unitsConcentration);
    }
    private async seedUnitsMeasurement(dataSource: DataSource) {
        const repositoryUnitsMeasurement = dataSource.getRepository(UnitsMeasurement);
        const unitsMeasurement = [
            { name: 'ug', code: '01', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: 'mg', code: '02', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: 'g', code: '03', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: 'kg', code: '04', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: 'ml', code: '05', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: 'dl', code: '06', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            { name: 'l', code: '07', isActive: true, user: { id: 1 }, userUpdate: { id: 1 } },
            {
                name: 'Unidades',
                code: '08',
                isActive: true,
                user: { id: 1 },
                userUpdate: { id: 1 },
            },
        ];

        await repositoryUnitsMeasurement.save(unitsMeasurement);
    }
}
