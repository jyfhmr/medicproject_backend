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
import { SubCategoriesService } from './sub-categories.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { Public } from 'src/decorators/isPublic.decorator';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@Controller('inventory/maintenance/sub-categories')
export class SubCategoriesController {
    constructor(private readonly subCategoriesService: SubCategoriesService) {}

    @Public()
    @Get('export')
    async exportData(@Query() query: any, @Res() res: Response): Promise<void> {
        query.export = 1;
        const data: any = await this.subCategoriesService.findAll(query);
        await this.subCategoriesService.exportDataToExcel(data.data, res);
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
        return this.subCategoriesService.processExcel(file.buffer);
    }

    @Post()
    create(@Body() createSubCategoryDto: CreateSubCategoryDto, @Request() req: any) {
        return this.subCategoriesService.create(createSubCategoryDto, req.user.sub);
    }

    @Get('list')
    listSubCategories() {
        return this.subCategoriesService.listSubCategories();
    }

    @Get()
    findAll(@Query() query: any) {
        return this.subCategoriesService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.subCategoriesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSubCategoryDto: UpdateSubCategoryDto) {
        return this.subCategoriesService.update(+id, updateSubCategoryDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.subCategoriesService.remove(+id);
    }

    @Patch(':id/change_status')
    changeStatus(@Param('id', ParseIntPipe) id: number) {
        return this.subCategoriesService.changeStatus(id);
    }
}
