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
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    BadRequestException,
} from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { CreateCatalogueDto } from './dto/create-catalogue.dto';
import { UpdateCatalogueDto } from './dto/update-catalogue.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as multer from 'multer';

@Controller('inventory/catalogue')
export class CatalogueController {
    constructor(private readonly catalogueService: CatalogueService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.catalogueService.findAll(query);
        await this.catalogueService.exportDataToExcel(data.data, res);
    }

    @Post()
    @UseInterceptors(
        FileInterceptor('img', {
            storage: diskStorage({
                destination: './uploads/inventory/catalogue/img',
                filename(req, file, callback) {
                    //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    const filename = `${req.body.barcode}_${req.body.code}${ext}`;
                    callback(null, filename);
                },
            }),
        }),
    )
    @Post()
    create(
        @Body() createCatalogueDto: CreateCatalogueDto,
        @Request() req: any,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5000000 }),
                    new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
                ],
                fileIsRequired: false,
            }),
        )
        file?: Express.Multer.File,
    ) {
        return this.catalogueService.create(
            createCatalogueDto,
            req.user.sub,
            file?.filename || null,
        );
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
        return this.catalogueService.processExcel(file.buffer);
    }

    @Get()
    findAll(@Query() query: any) {
        return this.catalogueService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.catalogueService.findOne(+id);
    }

    @Patch(':id')
    @UseInterceptors(
        FileInterceptor('img', {
            storage: diskStorage({
                destination: './uploads/inventory/catalogue/img',
                filename(req, file, callback) {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    const filename = `${uniqueSuffix}_${req.body.barcode}_${req.body.code}${ext}`;
                    callback(null, filename);
                },
            }),
        }),
    )
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCatalogueDto: UpdateCatalogueDto,
        @Request() req: any,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5000000 }),
                    new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
                ],
                fileIsRequired: false,
            }),
        )
        file?: Express.Multer.File,
    ) {
        return this.catalogueService.update(
            id,
            updateCatalogueDto,
            req.user.sub,
            file?.filename || null,
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.catalogueService.remove(+id);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.catalogueService.changeStatus(id);
    }

    @Post('/update_code')
    update_code() {
        return this.catalogueService.update_code();
    }
}
