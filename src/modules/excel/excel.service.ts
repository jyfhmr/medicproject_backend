import { Injectable } from '@nestjs/common';
import { CreateExcelDto } from './dto/create-excel.dto';
import { UpdateExcelDto } from './dto/update-excel.dto';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class ExcelService {
    async createForExcelForView(dataForExcel: any, res: Response) {
        console.log('DATA FOR EXCEL LLEGANDO', dataForExcel);

        //Crea el libro de trabajo
        const workbook = new ExcelJS.Workbook();
        console.log('Libro creado 1');

        //Crea la página
        const worksheet = this.createWorksheet(workbook);
        console.log('Pagina Creada 2');

        //Añade Título
        worksheet.addRow([dataForExcel.title]);
        console.log('Titulo Añadido 3');

        //Generar Columnas
        const columns = this.generateColumns(dataForExcel.columns);
        worksheet.columns = columns;
        console.log('Columnas Añadidas 4');

        //Generar estilos en excel
        this.giveStylesToExcel(worksheet);
        console.log('Estilos dados 5');

        //Genera filas de datos y las inserta
        const rows = this.generateDataRows(dataForExcel.data, columns, worksheet);
        worksheet.addRow(rows);
        console.log('Data generada 6');

        // Configurar el encabezado de la respuesta HTTP
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');

        // Escribir el libro de trabajo en la respuesta HTTP
        await workbook.xlsx.write(res);
        res.end();
    }

    createWorksheet(workbook: any) {
        const worksheet = workbook.addWorksheet('Data');
        return worksheet;
    }

    generateColumns(data: any[]) {
        console.log('Columnas a generar', data);

        var dataColumns: any = [];

        data.map((rowFromFrontend) => {
            console.log('ROW FROMF RONTEND', rowFromFrontend);

            const rowToAdd: any = {};

            //No nos interesa en el excel la columna de acciones
            if (rowFromFrontend.index === 'actions') {
                return;
            }

            rowToAdd.header = rowFromFrontend.title;
            if(rowFromFrontend.property){

              //a los objetos se les da key unica
              rowToAdd.key = rowFromFrontend.index+"/"+rowFromFrontend.property;

            }else{
              rowToAdd.key = rowFromFrontend.index;
            }
            
            rowToAdd.width = 30;
            rowToAdd.property = rowFromFrontend.property;
            rowToAdd.genericKey = rowFromFrontend.index;

            //un caso especial, la columna ID no ocupa espacio , asi que debe tener menos width
            if (rowFromFrontend.title === 'ID' || rowFromFrontend.title === 'id') {
                rowToAdd.width = 15;
            }

            dataColumns.push(rowToAdd);
        });

        console.log('DATA COLUMNS', dataColumns);
        return dataColumns;
    }

    giveStylesToExcel(worksheet: any) {
        worksheet.getRow(2).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '2a953d' },
        };
        worksheet.getRow(2).font = { bold: true };
        worksheet.getRow(2).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(2).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
        };
    }

    generateDataRows(data, columns, worksheet) {
        //La data del frontend es con la que se llenan los rows

        //Por cada registro del frontend se tiene que generar un ROW en excel
        data.forEach((dataRowFromFrontend) => {
            const row: any = {};

            console.log('DATA ROW', dataRowFromFrontend);

            //Esos rows se generan creando un par clave y valor con los índices de las columnas

            for (let i = 0; i < columns.length; i++) {
                let indexOfColumn = columns[i].key;

                console.log('column', columns[i]);

                console.log('Value de la row, ', dataRowFromFrontend[indexOfColumn]);

                //Implica que es un objeto
                if (columns[i].property) {

                  console.log("es un objeto",columns[i])
                  console.log("row from frontend",dataRowFromFrontend)

                  //leo la propiedad objeto que puede ser compartida por otras columnas
                  //que leen el mismo objeto
                    const objectInDataRow = dataRowFromFrontend[columns[i].genericKey];

                    if (objectInDataRow && objectInDataRow[columns[i].property]) {
                        row[indexOfColumn] = objectInDataRow[columns[i].property];
                    } else {
                        row[indexOfColumn] = '';
                    }
                } else {
                    //Sino, es una propiedad normal, le damos el damos el valor directamente, leemos de la data , que es un objeto, su indice que viene del column
                    var valueOfColumn = dataRowFromFrontend[indexOfColumn];

                    //Casos especiales para valores booleanos
                    if (valueOfColumn === true) {
                        valueOfColumn = 'Activo';
                    } else if (valueOfColumn === false) {
                        valueOfColumn = 'Inactivo';
                    }

                    row[indexOfColumn] = valueOfColumn;
                }
            }

            console.log('row antes de guardarse', row);
            const rowJustInserted = worksheet.addRow(row);

            rowJustInserted.alignment = { vertical: 'middle', horizontal: 'left' };
            rowJustInserted.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        console.log('Data generada');
    }
}
