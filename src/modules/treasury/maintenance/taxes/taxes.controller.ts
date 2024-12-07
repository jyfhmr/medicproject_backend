import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Query,
    Res,
    UseInterceptors,
    BadRequestException,
    UploadedFile,
    ParseIntPipe,
    Request,
    Body,
    ConflictException,
} from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';
import * as multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
@Controller('treasury/maintenance/taxes')
export class TaxesController {
    constructor(private readonly taxesService: TaxesService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.taxesService.findAll(query);
        await this.taxesService.exportDataToExcel(data.data, res);
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
        return this.taxesService.processExcel(file.buffer);
    }

    @Post()
    async create(@Body() createTaxDto: CreateTaxDto, @Request() req: any) {
        try {
            return await this.taxesService.create(createTaxDto, req.user.sub);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTaxDto: UpdateTaxDto, @Request() req: any) {
        return this.taxesService.update(+id, updateTaxDto, req.user.sub);
    }

    @Get()
    findAll(@Query() query: any) {
        return this.taxesService.findAll(query);
    }
    @Get('typeTax')
    findAllTypeTax(@Query() query: any) {
        return this.taxesService.findAllTypeTax(query);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.taxesService.findOne(id);
    }

    @Get('searchByTypeTax/:typeTax/list')
    searchByTypeTax(@Param('typeTax', ParseIntPipe) typeTax: number) {
        return this.taxesService.searchByTypeTax(typeTax);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.taxesService.changeStatus(id);
    }
}
