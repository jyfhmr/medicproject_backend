import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Res,
    Request,
    Query,
    ParseIntPipe,
    UseInterceptors,
    BadRequestException,
    UploadedFile,
} from '@nestjs/common';
import { QuantitiesPackageService } from './quantities-package.service';
import { CreateQuantitiesPackageDto } from './dto/create-quantities-package.dto';
import { UpdateQuantitiesPackageDto } from './dto/update-quantities-package.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';
import * as multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('inventory/maintenance/quantities-package')
export class QuantitiesPackageController {
    constructor(private readonly quantitiesPackageService: QuantitiesPackageService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.quantitiesPackageService.findAll(query);
        await this.quantitiesPackageService.exportDataToExcel(data.data, res);
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
        return this.quantitiesPackageService.processExcel(file.buffer);
    }

    @Post()
    create(@Body() createQuantitiesPackageDto: CreateQuantitiesPackageDto, @Request() req: any) {
        return this.quantitiesPackageService.create(createQuantitiesPackageDto, req.user.sub);
    }

    @Get('list')
    listQuantitiesPackage() {
        return this.quantitiesPackageService.listQuantitiesPackage();
    }

    @Get()
    findAll(@Query() query: any) {
        return this.quantitiesPackageService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.quantitiesPackageService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateQuantitiesPackageDto: UpdateQuantitiesPackageDto,
    ) {
        return this.quantitiesPackageService.update(+id, updateQuantitiesPackageDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.quantitiesPackageService.remove(+id);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.quantitiesPackageService.changeStatus(id);
    }
}
