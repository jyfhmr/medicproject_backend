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
import { TypesPackagingService } from './types-packaging.service';
import { CreateTypesPackagingDto } from './dto/create-types-packaging.dto';
import { UpdateTypesPackagingDto } from './dto/update-types-packaging.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';
import * as multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('inventory/maintenance/types-packaging')
export class TypesPackagingController {
    constructor(private readonly typesPackagingService: TypesPackagingService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.typesPackagingService.findAll(query);
        await this.typesPackagingService.exportDataToExcel(data.data, res);
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
        return this.typesPackagingService.processExcel(file.buffer);
    }

    @Post()
    create(@Body() createTypesPackagingDto: CreateTypesPackagingDto, @Request() req: any) {
        return this.typesPackagingService.create(createTypesPackagingDto, req.user.sub);
    }

    @Get('list')
    listTypesPackaging() {
        return this.typesPackagingService.listTypesPackaging();
    }

    @Get()
    findAll(@Query() query: any) {
        return this.typesPackagingService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.typesPackagingService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTypesPackagingDto: UpdateTypesPackagingDto) {
        return this.typesPackagingService.update(+id, updateTypesPackagingDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.typesPackagingService.remove(+id);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.typesPackagingService.changeStatus(id);
    }
}
