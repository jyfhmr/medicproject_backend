import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
    Res,
    Query,
    ParseIntPipe,
    UseInterceptors,
    BadRequestException,
    UploadedFile,
} from '@nestjs/common';
import { UnitsMeasurementService } from './units-measurement.service';
import { CreateUnitsMeasurementDto } from './dto/create-units-measurement.dto';
import { UpdateUnitsMeasurementDto } from './dto/update-units-measurement.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller('inventory/maintenance/units-measurement')
export class UnitsMeasurementController {
    constructor(private readonly unitsMeasurementService: UnitsMeasurementService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.unitsMeasurementService.findAll(query);
        await this.unitsMeasurementService.exportDataToExcel(data.data, res);
    }

    @Public()
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: multer.memoryStorage(), // Guardar el archivo en memoria para facilitar la lectura
            fileFilter: (req, file, cb) => {
                if (!file.originalname.match(/\.(xls|xlsx)$/)) {
                    return cb(new BadRequestException('Only Excel files are allowed!'), false);
                }
                cb(null, true);
            },
        }),
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        // Llamar al servicio para procesar el archivo Excel
        return this.unitsMeasurementService.processExcel(file.buffer);
    }

    @Post()
    create(@Body() createUnitsMeasurementDto: CreateUnitsMeasurementDto, @Request() req: any) {
        return this.unitsMeasurementService.create(createUnitsMeasurementDto, req.user.sub);
    }

    @Get('list')
    listUnitsMeasurement() {
        return this.unitsMeasurementService.listUnitsMeasurement();
    }

    @Get()
    findAll(@Query() query: any) {
        return this.unitsMeasurementService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.unitsMeasurementService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUnitsMeasurementDto: UpdateUnitsMeasurementDto) {
        return this.unitsMeasurementService.update(+id, updateUnitsMeasurementDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.unitsMeasurementService.remove(+id);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.unitsMeasurementService.changeStatus(id);
    }
}
