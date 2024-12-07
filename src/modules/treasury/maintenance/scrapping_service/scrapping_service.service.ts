import { 
  HttpException, 
  Injectable, 
  InternalServerErrorException, 
  forwardRef, 
  Inject 
} from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ExchangeRateService } from '../../../audits/exchange_rate/exchange_rate.service';
import { Http } from 'winston/lib/winston/transports';

@Injectable()
export class ScrappingServiceService {
  private readonly url = 'https://www.bcv.org.ve/';
  private readonly maxRetries = 10;
  private readonly retryDelay = 2000; // 2 segundos de espera entre reintentos

  constructor(
      @Inject(forwardRef(() => ExchangeRateService))
      private readonly exchangeRateService: ExchangeRateService,
  ) { }

  /**
   * Obtiene las tasas de cambio desde el sitio web del BCV y las guarda en la base de datos.
   * Implementa un sistema de reintentos de hasta 10 intentos en caso de fallos específicos.
   */
  async getExchangeRates(): Promise<any> {
      const resultMessage = {
          "conn": 200,
          "usd": 0,
          "eur": 0,
          "usdRate": 0,
          "eurRate": 0
      };

      for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
          try {
              const response = await axios.get(this.url, { timeout: 30000 });
              const $ = cheerio.load(response.data);

              const usdHtml = $('#dolar').html();
              const eurHtml = $('#euro').html();

              if ((!usdHtml) || (!eurHtml)) {
                  throw new HttpException("La tasa no pudo ser obtenida, posiblemente hubo un cambio en el sitio del BCV, contactar al desarrollador (0)", 500);
              }

              resultMessage.usdRate = this.getChange(usdHtml);
              resultMessage.eurRate = this.getChange(eurHtml);

              resultMessage.usd = await this.createExchangeRate(1, resultMessage.usdRate);
              resultMessage.eur = await this.createExchangeRate(3, resultMessage.eurRate);

             

              // Si todo ha salido bien, retornamos el resultado
              return resultMessage;

          } catch (error) {
              console.log(`Intento ${attempt} fallido. Error:`, error.message || error);

              // Determinamos si el error es recuperable
              const isRecoverable = this.isRecoverableError(error);

              if (isRecoverable) {
                  resultMessage.conn = 503; // Servicio no disponible
                  if (attempt < this.maxRetries) {
                      console.log(`Reintentando en ${this.retryDelay / 1000} segundos... (Intento ${attempt}/${this.maxRetries})`);
                      await this.delay(this.retryDelay);
                      continue; // Continua al siguiente intento
                  } else {
                      console.log(`Máximo de intentos alcanzado (${this.maxRetries}). Retornando error.`);
                      return { ...resultMessage, conn: 503 };
                  }
              } else {
                  // Error crítico, no reintentar
                  resultMessage.conn = 500;
                  console.log(`Error crítico detectado. No se reintentará. Estado: 500.`);
                  return resultMessage;
              }
          }
      }

      // En caso extremo de que el bucle no retorne, lo cual no debería suceder
      throw new InternalServerErrorException("Error inesperado en el proceso de obtención de tasas de cambio.");
  }

  /**
   * Determina si un error es recuperable y se puede intentar nuevamente.
   * @param error El error capturado en el bloque catch
   */
  private isRecoverableError(error: any): boolean {

    console.log("error en isRecorable?",error)

      if (error.code === 'ECONNABORTED' || 
          error.code === "ECONNRESET" || 
          error.code === "ENOTFOUND" || 
          error.code === 'ETIMEDOUT') {
          return true;
      } else if (error instanceof HttpException) {
          const status = error.getStatus();

          console.log(" el status",status)

          return status === 500 || status === 503;
      }
      return false; // Otros errores son considerados críticos
  }

  /**
   * Función auxiliar para crear una pausa entre reintentos.
   * @param ms Milisegundos a esperar
   */
  private delay(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Extrae y parsea el valor de cambio de la tasa desde el HTML.
   */
  private getChange(html: string): number {


      try {
          const $ = cheerio.load(html);
          const element = $('strong');
          let text = element.text().trim();
          text = text.replace(',', '.');
          const rate = parseFloat(text);

          if (isNaN(rate)) {
              throw new HttpException(
                  'La tasa no pudo ser obtenida, posiblemente hubo un cambio en el sitio del BCV, contactar al desarrollador (1)',
                  500,
              );
          }

          return rate;

      } catch (error) {
          throw new HttpException("La tasa no pudo ser obtenida, posiblemente hubo un cambio en el sitio del BCV, contactar al desarrollador (2)", 500);
      }
  }

  /**
   * Crea una tasa de cambio y maneja los posibles errores.
   */
  private async createExchangeRate(currencyId: number, exchangeRate: number): Promise<number> {


    
      try {
          const res = await this.exchangeRateService.create(
              {
                  currencyId,
                  exchangeToCurrency: 2,
                  exchange: exchangeRate,
              },
              null,
              true
          );

          if (res.includes('¡Tasa de cambio creada con éxito!')) {
              return 201;
          } else {
              return 500;
          }
      } catch (error) {
          return this.handleServiceError(error, currencyId === 1 ? 'USD' : 'EUR');
      }
  }

  /**
   * Maneja errores específicos del servicio de creación de tasas de cambio.
   */
  private handleServiceError(error: any, currency: string): number {

    console.log("el error",error)

      if (error.status === 409) {
          return error.status;
      } else {
          return 500;
      }
  }
}
