import { Treasury_maintenance_PaymentMethod } from 'src/modules/treasury/maintenance/payment_method/entities/payment_method.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Treasury_maintenance_Money } from 'src/modules/treasury/maintenance/money/entities/money.entity';

export class PaymentMethodSeeder1721921619969 implements Seeder {
    track = false;

    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        const paymentMethodRepository = dataSource.getRepository(Treasury_maintenance_PaymentMethod);
        const currencyRepository = dataSource.getRepository(Treasury_maintenance_Money);
        
        const currency = [
            { money: 'Dólar', symbol: 'USD',file: "usd.svg" ,isActive: true },
            { money: 'Bolívar', symbol: 'BSF', isActive: true },
            { money: 'Euro', symbol: 'EUR', file: "eur.png" ,isActive: true },
            { money: 'Bitcoin', symbol: 'BTC', isActive: true },
        ]
        await currencyRepository.save(currency);

        // Obtener las monedas existentes
        const usdCurrency = await currencyRepository.findOne({ where: { symbol: 'USD' } });
        const eurCurrency = await currencyRepository.findOne({ where: { symbol: 'EUR' } });
        const bsfCurrency = await currencyRepository.findOne({ where: { symbol: 'BSF' } });
        const btcCurrency = await currencyRepository.findOne({ where: { symbol: 'BTC' } });
        // Agrega otras monedas según necesites

        // Crear un mapa para acceder fácilmente a las monedas
        const currenciesMap = {
            USD: usdCurrency,
            EUR: eurCurrency,
            BSF: bsfCurrency,
            BTC: btcCurrency
            // Añade otras monedas
        };

        const paymentMethods = [
            {
                method: 'Tarjeta de crédito',
                typeMethodPayment: 'Crédito',
                description: 'Pago con tarjeta de crédito',
                code: 1,
                isActive: true,
                currencies_available_for_this_method: [currenciesMap.USD, currenciesMap.EUR, currenciesMap.BSF], // Asociar monedas
            },
            {
                method: 'Tarjeta de débito',
                typeMethodPayment: 'Débito',
                description: 'Pago con tarjeta de débito',
                code: 2,
                isActive: true,
                currencies_available_for_this_method: [currenciesMap.USD, currenciesMap.EUR, currenciesMap.BSF],
            },
            {
                method: 'Transferencia bancaria',
                typeMethodPayment: 'Transferencia',
                description: 'Pago mediante transferencia bancaria',
                code: 3,
                isActive: true,
                currencies_available_for_this_method:[currenciesMap.USD, currenciesMap.EUR, currenciesMap.BSF],
            },
            {
                method: 'Pago móvil',
                typeMethodPayment: 'Móvil',
                description: 'Pago mediante aplicación de pago móvil',
                code: 4,
                isActive: true,
                currencies_available_for_this_method: [currenciesMap.BSF],
            },
            {
                method: 'PayPal',
                typeMethodPayment: 'Digital',
                description: 'Pago mediante PayPal',
                code: 5,
                isActive: true,
                currencies_available_for_this_method: [currenciesMap.USD, currenciesMap.EUR],
            },
            {
                method: 'Efectivo',
                typeMethodPayment: 'Efectivo',
                description: 'Pago en efectivo',
                code: 6,
                isActive: true,
                currencies_available_for_this_method: [currenciesMap.USD, currenciesMap.EUR, currenciesMap.BSF],
            },
            {
                method: 'Bitcoin',
                typeMethodPayment: 'Criptomoneda',
                description: 'Pago mediante Bitcoin',
                code: 7,
                isActive: true,
                currencies_available_for_this_method: [currenciesMap.BTC],
            },
            {
                method: 'Zelle',
                typeMethodPayment: 'Digital',
                description: 'Pago mediante Zelle',
                code: 8,
                isActive: true,
                currencies_available_for_this_method: [currenciesMap.USD],
            },
            {
                method: 'Depósito',
                typeMethodPayment: 'Depósito',
                description: 'Depósito Bancario',
                code: 9,
                isActive: true,
                currencies_available_for_this_method: [currenciesMap.USD, currenciesMap.EUR, currenciesMap.BSF],
            },
        ];

        // Guardar los métodos de pago con sus monedas asociadas
        for (const paymentMethodData of paymentMethods) {
            const paymentMethod = paymentMethodRepository.create(paymentMethodData);
            await paymentMethodRepository.save(paymentMethod);
        }
    }
}
