import { HttpException, Injectable } from '@nestjs/common';
import { CreatePdfDto } from './dto/create-pdf.dto';
import { UpdatePdfDto } from './dto/update-pdf.dto';
import puppeteer from 'puppeteer';
import { Response } from 'express';

@Injectable()
export class PdfService {

//     async generatePdfFromHtml(htmlContent: any, res: Response) {
//   console.log("llegando a generar el pdf...", htmlContent);
//   try {
//     // Lanzar un navegador Chromium controlado por Puppeteer (en modo headless)
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     // Crear el HTML con la imagen embebida correctamente
//     const html = `
//       <html>
//         <head>
//           <title>PDF con Imagen</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               padding: 20px;
//             }
//             img {
//               max-width: 100%;
//               height: auto;
//             }
//           </style>
//         </head>
//         <body>
//           <h1>Este es un PDF con imagen</h1>
//           <p>A continuación, se muestra la imagen:</p>
//           <img src="${htmlContent.image}" alt="Imagen generada" />
//         </body>
//       </html>
//     `;

//     // Configurar el contenido HTML que será convertido en PDF
//     await page.setContent(html, { waitUntil: 'domcontentloaded' });

//     // Generar el PDF
//     const pdfBuffer = await page.pdf({
//       format: 'A4', // Formato del PDF
//       printBackground: true, // Incluir fondos en el PDF
//     });

//     // Cerrar el navegador
//     await browser.close();

//     // Configurar los encabezados de la respuesta
//     res.set({
//       'Content-Type': 'application/pdf',
//       'Content-Disposition': 'attachment; filename=generated.pdf',
//       'Content-Length': pdfBuffer.length,
//     });

//     // Enviar el PDF generado como respuesta
//     res.end(pdfBuffer);
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     throw new HttpException("No se pudo generar el PDF", 500);
//   }
// }


async generatePdfFromHtml(htmlContent: any, res: Response) {
  console.log("llegando a generar el pdf...", htmlContent);
  try {
    // Lanzar un navegador Chromium controlado por Puppeteer (en modo headless)
    const browser = await puppeteer.launch({ headless: true});
    const page = await browser.newPage();

    // Crear el HTML con la imagen embebida correctamente y el evento onload
    const html = `
      <html>
        <head>
          <title>Registro Clínico</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            img {
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <img id="generatedImage" src="${htmlContent.image}" alt="Imagen generada" onload="window.imageLoaded = true;" />
          <script>
            window.imageLoaded = false;
            var img = document.getElementById('generatedImage');
            img.onload = function() {
              window.imageLoaded = true;
            };
          </script>
        </body>
      </html>
    `;

    // Configurar el contenido HTML que será convertido en PDF
    await page.setContent(html, { waitUntil: 'networkidle0' }); // Esperar a que todos los recursos (incluidas las imágenes) se carguen

    // Esperar explícitamente a que la imagen se haya cargado completamente
    await page.waitForFunction('window.imageLoaded === true', { timeout: 60000 });

    // Generar el PDF
    const pdfBuffer = await page.pdf({
      format: 'A4', // Formato del PDF
      printBackground: true, // Incluir fondos en el PDF
    });

    // Cerrar el navegador
    await browser.close();

    // Configurar los encabezados de la respuesta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=generated.pdf',
      'Content-Length': pdfBuffer.length,
    });

    // Enviar el PDF generado como respuesta
    res.end(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new HttpException("No se pudo generar el PDF", 500);
  }
}



    findAll() {
        return `This action returns all pdf`;
    }

    findOne(id: number) {
        return `This action returns a #${id} pdf`;
    }

    update(id: number, updatePdfDto: UpdatePdfDto) {
        return `This action updates a #${id} pdf`;
    }

    remove(id: number) {
        return `This action removes a #${id} pdf`;
    }
}
