// src/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    console.log("Error capturado en el exception filter, log generado en filters/filterlogs:", exception.message);

    // Determinar el estado HTTP
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Crear el objeto de respuesta
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message || 'Internal server error',
    };

    //console.log("error response", errorResponse)

    // Registrar el error en un archivo de texto
    try {
      this.logErrorToFile(exception, request);
    } catch (logError) {
      console.error('Error al registrar el log:', logError);
    }

    // Enviar la respuesta al cliente
    response.status(status).json(errorResponse);
  }

  private logErrorToFile(exception: any, request: Request) {
    const logDirectory = path.join(process.cwd(), 'src/filters', 'filterlogs');
    const logFilePath = path.join(logDirectory, 'error.log');

   // console.log("DIRNAME",__dirname)

    //console.log("el directorio",logDirectory)
    // Asegurarse de que el directorio de logs exista
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory, { recursive: true }); // Añadir { recursive: true } por seguridad
    }

    // Formatear el mensaje de error
    const logMessage = `[${new Date().toISOString()}] Error en ${request.method} ${request.url}
Mensaje: ${exception.message}
Stack: ${exception.stack}

`;

    // Escribir el error en el archivo de forma síncrona para evitar condiciones de carrera
    fs.appendFileSync(logFilePath, logMessage, { encoding: 'utf8' });
  }
}
