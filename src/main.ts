import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
// import { LoggerService } from './services/logger/logger.service';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';

config();

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        // logger: new LoggerService(),
    });

    // const microservice = app.connectMicroservice<MicroserviceOptions>({
    //     transport: Transport.TCP,
    //     options: {
    //         host: process.env.AUTH_SERVICE_HOST,
    //         port: 3004,
    //     },
    // });

    // app.enableCors({
    //     origin: process.env.FRONT_URL,
    //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    //     credentials: true,
    // });

    app.enableCors({
        origin: (origin, callback) => {
            console.log(origin);
            const allowedOrigins = [process.env.FRONT_URL || 'http://localhost:3001'];
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.error('origin-' + origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useGlobalFilters(new HttpExceptionFilter());
    app.setGlobalPrefix('api');
    app.useStaticAssets('uploads', {
        prefix: '/uploads/',
    });
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, // Transforma automáticamente los tipos de datos
            exceptionFactory: (errors) => {
                // Personaliza el formato de los errores
                const formattedErrors = errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints,
                }));
                console.log("ERRORES PROCEDENTES DEL DTO",formattedErrors)
                return new BadRequestException(formattedErrors);
            },
        }),
    );
    configSwagger(app);
    await app.startAllMicroservices();
    await app.listen(process.env.SERVER_PORT);
}

bootstrap();

const configSwagger = (app) => {
    const config = new DocumentBuilder()
        .setTitle('Documentación Backend PosPharma')
        .setDescription(
            'Este es el proyecto para el sistema pos de la farmacias aliadas a GoPharma',
        )
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('actions')
        .addTag('applications')
        .addTag('auth')
        .addTag('cashier_types')
        .addTag('cashiers')
        .addTag('cities')
        .addTag('companies')
        .addTag('printer_brands')
        .addTag('printer_models')
        .addTag('printer_types')
        .addTag('printers')
        .addTag('profiles')
        .addTag('states')
        .addTag('status')
        .addTag('users')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
};
